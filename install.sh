# node.js, then npm install
echo "Installing resilienz with all dependencies"
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y nodejs
npm run config
npm install
npm run createui
npm run minifyui
npm run preflight
echo "Installation Complete. Run 'npm start' to get going!"
