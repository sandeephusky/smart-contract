# This project runs on the following IPNS:
ipns://k51qzi5uqu5djaqzr14lk3v2twomh3odmtyc5z3ftivd9l5mbdmmk4ni05bmwz

Download IPFS Desktop application before proceeding with the steps mentioned below.

# Steps to deploy your application to IPFS:

1. Navigate into the folder where the frontend code is available.
2. Install ipfs using the following command:
    brew install ipfs
3. Then, run the following command:
    npx run build
3. Once the build is generated run the following commands:
    a. ipfs add -r build
    b. ipfs init
4. From the list of ipfs Hash values, select the last one and run the following command:
    ipfs name publish <"hash value">
5. Copy the result value starting at 'k' till before ':' and run the following command in the browser:
    ipns://<ipfs hash>
    Ex: ipns://k51qzi5uqu5dgysix0pzsztua64r382kxonysgekucmbdggeh0f734lw9vzi2i
    http://k51qzi5uqu5dgysix0pzsztua64r382kxonysgekucmbdggeh0f734lw9vzi2i.ipns.localhost:8080/

If the ipns url above is not working or is throwing 504 timeout error, install ipfs browser extension and try again