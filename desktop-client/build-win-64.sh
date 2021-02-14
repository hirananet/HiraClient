rm -rf dist
cd ../web-client
ng build --output-path ../desktop-client/www --configuration electron --base-href .
cd ../desktop-client
npm run dist -w --x64