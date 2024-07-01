# setup 
docker pull stripe/stripe-cli

# stripe login
docker run --rm -e STRIPE_API_KEY=sk_test_51PCfBhJ2BXtwdiWSUlAIT5Htx5Br8McexHjp61d8g4vjKMWzq8oAi9pqOfI7cFpb5dz85ErILeeG8jDhrseXe4pv00x9I1qZZd stripe/stripe-cli login
    
# docker run --network="host" --rm -it --env-file .webhook_env stripe/stripe-cli listen -p 5000:5000 --forward-to http://host.docker.internal:5000/webhook  --skip-verify --api-key $STRIPE_API_KEY
docker run --network="host" --rm -it stripe/stripe-cli -p 3333:5000  listen --forward-to http://host.docker.internal:5000/webhook --skip-verify --api-key sk_test_51PCfBhJ2BXtwdiWSUlAIT5Htx5Br8McexHjp61d8g4vjKMWzq8oAi9pqOfI7cFpb5dz85ErILeeG8jDhrseXe4pv00x9I1qZZd

# Forward events to your webhood
docker run --rm --env-file .env stripe/stripe-cli trigger payment_intent.succeeded
