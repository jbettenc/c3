const GRAPHQL_ENDPOINT = "https://api.studio.thegraph.com/query/49892/c3-base-goerli/v0.1.1";

export const loadPetition = async (id: string) => {
  let res: any = null;
  const query = `{
        petition(id: "${id}") {
            id
            cid
            petitioner
            signatures
            timestamp
          }
    }`;

  await fetch(`${GRAPHQL_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: query
    })
  })
    .then((res) => res.json())
    .then((response) => {
      res = response?.data?.petition;
    });

  return res ?? null;
};

export const loadPetitionSigners = async (id: string) => {
  let res: any = null;
  const query = `{
    petitionSigneds(where: {petitionUuid: "${id}"}) {
      id
      petitionUuid
      signer
      timestamp
    }
  }`;

  await fetch(`${GRAPHQL_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: query
    })
  })
    .then((res) => res.json())
    .then((response) => {
      res = response?.data?.petitionSigneds;
    });

  return res ?? null;
};
