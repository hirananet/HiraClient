ng build --prod
docker build -t alexander171294/hira-client .
docker tag alexander171294/hira-client alexander171294/hira-client:core-v2
docker push alexander171294/hira-client:core-v2
ssh -p 7639 alex@empireo.hirana.net "docker pull alexander171294/hira-client alexander171294/hira-client:core-v2"
ssh -p 7639 alex@empireo.hirana.net "docker stop hiraclient-v2"
ssh -p 7639 alex@empireo.hirana.net "docker run --rm -p 9002:80 --name hiraclient-v2 -itd alexander171294/hira-client:core-v2"
ssh -p 7639 alex@empireo.hirana.net "docker logs -f hiraclient-v2"
