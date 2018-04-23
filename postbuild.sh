printenv NODE_ENV

# run db migrations
cd ./test && node setup.js

# create build folder
cd ../dev && npm run build

cd ..

# clear previous builds
rm -rf ./test/dist

# move build folder
mv ./dev/dist ./test