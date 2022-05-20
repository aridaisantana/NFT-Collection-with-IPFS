export default async function handler(req, res) {
  // get the tokenId from the query params
  const tokenId = req.query.tokenId;
  // As all the images are uploaded on github, we can extract the images from github directly.
  const metada_url =
    "https://gateway.pinata.cloud/ipfs/QmRMqgKqFZ7KddkU1obdALP2wEzBDt4RkZkyh2u3BA74hu/" +
    tokenId +
    ".json";
  // The api is sending back metadata for a Crypto Dev
  // To make our collection compatible with Opensea, we need to follow some Metadata standards
  // when sending back the response from the api
  // More info can be found here: https://docs.opensea.io/docs/metadata-standards
  const fetchedData = await fetch(metada_url);
  console.log(fetchedData);
  const { name, description, image } = await fetchedData.json();

  res.status(200).json({
    name,
    description,
    image,
  });
}
