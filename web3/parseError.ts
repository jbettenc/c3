const parseWeb3Error = (error_message: string) => {
  const start = error_message.indexOf("(");
  const end = error_message.indexOf(")");

  if (error_message.includes("Error:")) {
    return error_message.substring(7, start);
  }

  const jsonStr = JSON.parse(
    error_message
      .substring(start + 1, end)
      .split(", ")[3]
      .substring(6)
  );
  const hexData = jsonStr.data.originalError.data;

  if (hexData == "0x44ed284e") {
    return "Petition already exists.";
  } else if (hexData == "0xb36e9f2f") {
    return "Petition does not exist.";
  } else if (hexData == "0x65085684") {
    return "Update already exists.";
  } else if (hexData == "0xb4c1e9ab") {
    return "Victory already declared.";
  } else if (hexData == "0x5d904cb2") {
    return "Invalid nullifier.";
  } else if (hexData == "0x82b42900") {
    return "Action is unauthorized.";
  } else {
    return error_message;
  }
};

export default parseWeb3Error;
