if [ -f .env ]; then
    export $(cat .env | grep -v ^# | xargs)
fi

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running migrations..."
  npm run migration:run
fi

npm run start

