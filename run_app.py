import os
import platform
import subprocess
import sys

def run_script_based_on_os():
    os_type = platform.system()

    if os_type == "Windows":
        print("System operacyjny: Windows")
        # Uruchom skrypt PowerShell
        try:
            subprocess.run(["powershell.exe", "-ExecutionPolicy", "Bypass", "-File", "./scripts/run_app_windows.ps1"], check=True)
        except subprocess.CalledProcessError as e:
            print(f"Błąd podczas uruchamiania skryptu PowerShell: {e}")
            sys.exit(1)

    elif os_type == "Linux" or os_type == "Darwin":
        print(f"System operacyjny: {os_type}")
        # Uruchom skrypt Bash
        try:
            subprocess.run(["bash", "./scripts/run_app_linux.sh"], check=True)
        except subprocess.CalledProcessError as e:
            print(f"Błąd podczas uruchamiania skryptu Bash: {e}")
            sys.exit(1)

    else:
        print("Nieznany system operacyjny")
        sys.exit(1)

if __name__ == "__main__":
    run_script_based_on_os()