## WAŻNE ##
# zanim uruchomicie skrypt trzeba sobie w powershellu wklepać tą komende, bo windows domyślnie blokuje skrypty w psh (XDDDD):
# Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned


# Paths to the client and server directories
$clientDir = "./client"
$serverDir = "./server"

# Commands to run in each directory
$clientCommand = "npm run dev"
$serverCommand = "npm run devStart"

# Start npm run dev in the client directory in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$clientDir`"; $clientCommand"

# Start npm run devStart in the server directory in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$serverDir`"; $serverCommand"
