import datetime
from typing import Any, Dict, List, Optional, cast

from packaging.version import Version
from typing_extensions import Unpack

from grotte.api import SandboxCreateResponse, handle_api_exception
from grotte.api.client.api.sandboxes import (
    delete_sandboxes_sandbox_id,
    get_sandboxes_sandbox_id,
    get_sandboxes_sandbox_id_metrics,
    post_sandboxes,
    post_sandboxes_sandbox_id_connect,
    post_sandboxes_sandbox_id_pause,
    post_sandboxes_sandbox_id_refreshes,
    post_sandboxes_sandbox_id_snapshots,
    post_sandboxes_sandbox_id_timeout,
)
from grotte.api.client.api.templates import delete_templates_template_id
from grotte.api.client.models import (
    ConnectSandbox,
    Error,
    NewSandbox,
    PostSandboxesSandboxIDRefreshesBody,
    PostSandboxesSandboxIDSnapshotsBody,
    PostSandboxesSandboxIDTimeoutBody,
    Sandbox,
    SandboxAutoResumeConfig,
    SandboxNetworkConfig,
    SandboxVolumeMount as SandboxVolumeMountAPI,
)
from grotte.api.client.types import UNSET
from grotte.connection_config import ApiParams, ConnectionConfig
from grotte.exceptions import (
    SandboxException,
    SandboxNotFoundException,
    TemplateException,
)
from grotte.sandbox.main import SandboxBase
from grotte.sandbox.sandbox_api import (
    SandboxLifecycle,
    get_auto_resume_enabled,
    McpServer,
    SandboxInfo,
    SandboxMetrics,
    SandboxNetworkOpts,
    SandboxQuery,
    SnapshotInfo,
)
from grotte.sandbox_sync.paginator import SandboxPaginator, get_api_client


class SandboxApi(SandboxBase):
    @staticmethod
    def list(
        query: Optional[SandboxQuery] = None,
        limit: Optional[int] = None,
        next_token: Optional[str] = None,
        **opts: Unpack[ApiParams],
    ) -> SandboxPaginator:
        """
        List all running sandboxes.

        :param query: Filter the list of sandboxes by metadata or state, e.g. `SandboxListQuery(metadata={"key": "value"})` or `SandboxListQuery(state=[SandboxState.RUNNING])`
        :param limit: Maximum number of sandboxes to return per page
        :param next_token: Token for pagination

        :return: List of running sandboxes
        """
        return SandboxPaginator(
            query=query,
            limit=limit,
            next_token=next_token,
            **opts,
        )

    @classmethod
    def _cls_get_info(
        cls,
        sandbox_id: str,
        **opts: Unpack[ApiParams],
    ) -> SandboxInfo:
        """
        Get the sandbox info.
        :param sandbox_id: Sandbox ID

        :return: Sandbox info
        """
        config = ConnectionConfig(**opts)

        api_client = get_api_client(config)
        res = get_sandboxes_sandbox_id.sync_detailed(
            sandbox_id,
            client=api_client,
        )

        if res.status_code == 404:
            raise SandboxNotFoundException(f"Sandbox {sandbox_id} not found")

        if res.status_code >= 300:
            raise handle_api_exception(res)

        if res.parsed is None:
            raise SandboxException("Body of the request is None")

        if isinstance(res.parsed, Error):
            raise SandboxException(f"{res.parsed.message}: Request failed")

        return SandboxInfo._from_sandbox_detail(res.parsed)

    @classmethod
    def _cls_kill(
        cls,
        sandbox_id: str,
        **opts: Unpack[ApiParams],
    ) -> bool:
        config = ConnectionConfig(**opts)

        if config.debug:
            # Skip killing the sandbox in debug mode
            return True

        api_client = get_api_client(config)
        res = delete_sandboxes_sandbox_id.sync_detailed(
            sandbox_id,
            client=api_client,
        )

        if res.status_code == 404:
            return False

        if res.status_code >= 300:
            raise handle_api_exception(res)

        return True

    @classmethod
    def _cls_set_timeout(
        cls,
        sandbox_id: str,
        timeout: int,
        **opts: Unpack[ApiParams],
    ) -> None:
        config = ConnectionConfig(**opts)

        if config.debug:
            # Skip setting timeout in debug mode
            return

        api_client = get_api_client(config)
        res = post_sandboxes_sandbox_id_timeout.sync_detailed(
            sandbox_id,
            client=api_client,
            body=PostSandboxesSandboxIDTimeoutBody(timeout=timeout),
        )

        if res.status_code == 404:
            raise SandboxNotFoundException(f"Sandbox {sandbox_id} not found")

        if res.status_code >= 300:
            raise handle_api_exception(res)

    @classmethod
    def _cls_refresh_ttl(
        cls,
        sandbox_id: str,
        duration: int,
        **opts: Unpack[ApiParams],
    ) -> None:
        config = ConnectionConfig(**opts)

        if config.debug:
            return

        api_client = get_api_client(config)
        res = post_sandboxes_sandbox_id_refreshes.sync_detailed(
            sandbox_id,
            client=api_client,
            body=PostSandboxesSandboxIDRefreshesBody(duration=duration),
        )

        if res.status_code == 404:
            raise SandboxNotFoundException(f"Sandbox {sandbox_id} not found")

        if res.status_code >= 300:
            raise handle_api_exception(res)

    @classmethod
    def _cls_set_network(
        cls,
        sandbox_id: str,
        internet_access: bool,
        **opts: Unpack[ApiParams],
    ) -> None:
        config = ConnectionConfig(**opts)

        if config.debug:
            return

        api_client = get_api_client(config)
        # PUT /sandboxes/{id}/network is not in the generated client; call raw httpx.
        # Body field is `allow_internet_access` — the server silently ignores
        # camelCase variants, so the snake_case form is load-bearing.
        res = api_client.get_httpx_client().request(
            "PUT",
            f"/sandboxes/{sandbox_id}/network",
            json={"allow_internet_access": internet_access},
        )

        if res.status_code == 404:
            raise SandboxNotFoundException(f"Sandbox {sandbox_id} not found")

        if res.status_code >= 300:
            raise SandboxException(
                f"Failed to set network access: {res.status_code} {res.text}"
            )

    @classmethod
    def _create_sandbox(
        cls,
        template: str,
        timeout: int,
        auto_pause: Optional[bool],
        allow_internet_access: bool,
        metadata: Optional[Dict[str, str]],
        env_vars: Optional[Dict[str, str]],
        secure: bool,
        mcp: Optional[McpServer] = None,
        network: Optional[SandboxNetworkOpts] = None,
        lifecycle: Optional[SandboxLifecycle] = None,
        volume_mounts: Optional[List[SandboxVolumeMountAPI]] = None,
        **opts: Unpack[ApiParams],
    ) -> SandboxCreateResponse:
        config = ConnectionConfig(**opts)

        should_auto_pause = (
            lifecycle["on_timeout"] == "pause" if lifecycle is not None else auto_pause
        )
        auto_resume_enabled = get_auto_resume_enabled(lifecycle)
        body = NewSandbox(
            template_id=template,
            auto_pause=(should_auto_pause if should_auto_pause is not None else UNSET),
            metadata=metadata or {},
            timeout=timeout,
            env_vars=env_vars or {},
            mcp=cast(Any, mcp) or UNSET,
            secure=secure,
            allow_internet_access=allow_internet_access,
            network=SandboxNetworkConfig(**network) if network else UNSET,
            volume_mounts=volume_mounts if volume_mounts else UNSET,
        )
        if auto_resume_enabled is not None:
            body.auto_resume = SandboxAutoResumeConfig(enabled=auto_resume_enabled)

        api_client = get_api_client(config)
        res = post_sandboxes.sync_detailed(
            body=body,
            client=api_client,
        )

        if res.status_code >= 300:
            raise handle_api_exception(res)

        if res.parsed is None:
            raise Exception("Body of the request is None")

        if isinstance(res.parsed, Error):
            raise SandboxException(f"{res.parsed.message}: Request failed")

        if Version(res.parsed.envd_version) < Version("0.1.0"):
            SandboxApi._cls_kill(res.parsed.sandbox_id)
            raise TemplateException(
                "You need to update the template to use the new SDK. "
                "You can do this by running `grotte template build` in the directory with the template."
            )

        domain = res.parsed.domain if isinstance(res.parsed.domain, str) else None
        envd_token = (
            res.parsed.envd_access_token
            if isinstance(res.parsed.envd_access_token, str)
            else None
        )
        traffic_token = (
            res.parsed.traffic_access_token
            if isinstance(res.parsed.traffic_access_token, str)
            else None
        )

        return SandboxCreateResponse(
            sandbox_id=res.parsed.sandbox_id,
            sandbox_domain=domain,
            envd_version=res.parsed.envd_version,
            envd_access_token=envd_token,
            traffic_access_token=traffic_token,
        )

    @classmethod
    def _cls_get_metrics(
        cls,
        sandbox_id: str,
        start: Optional[datetime.datetime] = None,
        end: Optional[datetime.datetime] = None,
        **opts: Unpack[ApiParams],
    ) -> List[SandboxMetrics]:
        config = ConnectionConfig(**opts)

        if config.debug:
            # Skip getting the metrics in debug mode
            return []

        api_client = get_api_client(config)
        res = get_sandboxes_sandbox_id_metrics.sync_detailed(
            sandbox_id,
            start=int(start.timestamp()) if start else UNSET,
            end=int(end.timestamp()) if end else UNSET,
            client=api_client,
        )

        if res.status_code >= 300:
            raise handle_api_exception(res)

        if res.parsed is None:
            return []

        if isinstance(res.parsed, Error):
            raise SandboxException(f"{res.parsed.message}: Request failed")

        # Convert to typed SandboxMetrics objects
        return [
            SandboxMetrics(
                cpu_count=metric.cpu_count,
                cpu_used_pct=metric.cpu_used_pct,
                disk_total=metric.disk_total,
                disk_used=metric.disk_used,
                mem_total=metric.mem_total,
                mem_used=metric.mem_used,
                timestamp=metric.timestamp,
            )
            for metric in res.parsed
        ]

    @classmethod
    def _cls_connect(
        cls,
        sandbox_id: str,
        timeout: Optional[int] = None,
        **opts: Unpack[ApiParams],
    ) -> Sandbox:
        timeout = timeout or SandboxBase.default_sandbox_timeout

        config = ConnectionConfig(**opts)

        api_client = get_api_client(
            config,
            headers={
                "Grotte-Sandbox-Id": sandbox_id,
                "Grotte-Sandbox-Port": str(config.envd_port),
            },
        )
        res = post_sandboxes_sandbox_id_connect.sync_detailed(
            sandbox_id,
            client=api_client,
            body=ConnectSandbox(timeout=timeout),
        )

        if res.status_code == 404:
            raise SandboxNotFoundException(f"Paused sandbox {sandbox_id} not found")

        if res.status_code >= 300:
            raise handle_api_exception(res)

        if isinstance(res.parsed, Error):
            raise SandboxException(f"{res.parsed.message}: Request failed")

        if res.parsed is None:
            raise SandboxException("Body of the request is None")

        return res.parsed

    @classmethod
    def _cls_create_snapshot(
        cls,
        sandbox_id: str,
        **opts: Unpack[ApiParams],
    ) -> SnapshotInfo:
        config = ConnectionConfig(**opts)

        api_client = get_api_client(config)
        res = post_sandboxes_sandbox_id_snapshots.sync_detailed(
            sandbox_id,
            client=api_client,
            body=PostSandboxesSandboxIDSnapshotsBody(),
        )

        if res.status_code == 404:
            raise SandboxNotFoundException(f"Sandbox {sandbox_id} not found")

        if res.status_code >= 300:
            raise handle_api_exception(res)

        if res.parsed is None:
            raise SandboxException("Body of the request is None")

        if isinstance(res.parsed, Error):
            raise SandboxException(f"{res.parsed.message}: Request failed")

        return SnapshotInfo(snapshot_id=res.parsed.snapshot_id)

    @classmethod
    def _cls_delete_snapshot(
        cls,
        snapshot_id: str,
        **opts: Unpack[ApiParams],
    ) -> bool:
        config = ConnectionConfig(**opts)

        api_client = get_api_client(config)
        res = delete_templates_template_id.sync_detailed(
            snapshot_id,
            client=api_client,
        )

        if res.status_code == 404:
            return False

        if res.status_code >= 300:
            raise handle_api_exception(res)

        return True

    @classmethod
    def _cls_pause(
        cls,
        sandbox_id: str,
        **opts: Unpack[ApiParams],
    ) -> str:
        config = ConnectionConfig(**opts)

        api_client = get_api_client(config)
        res = post_sandboxes_sandbox_id_pause.sync_detailed(
            sandbox_id,
            client=api_client,
        )

        if res.status_code == 404:
            raise SandboxNotFoundException(f"Sandbox {sandbox_id} not found")

        if res.status_code == 409:
            return sandbox_id

        if res.status_code >= 300:
            raise handle_api_exception(res)

        return sandbox_id
