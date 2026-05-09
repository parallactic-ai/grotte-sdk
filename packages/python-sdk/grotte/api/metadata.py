import platform

from importlib import metadata

package_version = metadata.version("grotte")

default_headers = {
    "lang": "python",
    "lang_version": platform.python_version(),
    "package_version": metadata.version("grotte"),
    "publisher": "grotte",
    "sdk_runtime": "python",
    "system": platform.system(),
}
