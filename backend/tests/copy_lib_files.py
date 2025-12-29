
import shutil
import os

pkg_path = r"D:\dinesh\backend\.venv\Lib\site-packages\google\adk"
files_to_copy = [
    os.path.join(pkg_path, "models", "google_llm.py"),
    os.path.join(pkg_path, "agents", "llm_agent.py")
]

for src in files_to_copy:
    if os.path.exists(src):
        dst = os.path.basename(src) + ".txt"
        shutil.copy(src, dst)
        print(f"Copied {src} to {dst}")
    else:
        print(f"File not found: {src}")
