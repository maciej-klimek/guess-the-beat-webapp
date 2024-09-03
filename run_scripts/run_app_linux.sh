## WAŻNE ## 
# przed uruchomieniem trzeba wykonać: chmod +x run_app_linux.sh
#!/bin/bash

# Navigate to the client directory and run npm run dev
(
  cd ./client || exit
  npm run dev
) &

# Navigate to the server directory and run npm run devStart
(
  cd ./server || exit
  npm run devStart
) &

# Wait for all background processes to complete
wait