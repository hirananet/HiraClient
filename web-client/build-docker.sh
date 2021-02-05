ng build --prod
docker build -t alexander171294/hira-client .
docker tag alexander171294/hira-client alexander171294/hira-client:core-v2
docker push alexander171294/hira-client:core-v2
