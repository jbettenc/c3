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

  if (hexData == "0x4c88ca2a") {
    return "Room already exists.";
  } else if (hexData == "0x4b4e8872") {
    return "Room does not exist.";
  } else if (hexData == "0x8890b3b1") {
    return "Room not joined.";
  } else if (hexData == "0xc2d944a7") {
    return "Room already joined.";
  } else if (hexData == "0x37416bb1") {
    return "Offer is empty.";
  } else if (hexData == "0x8b87d9bd") {
    return "Offer has expired.";
  } else if (hexData == "0x67e71c08") {
    return "Offer is invalid.";
  } else if (hexData == "0x8c12a053") {
    return "Action is unauthorized.";
  } else {
    return error_message;
  }
};

export default parseWeb3Error;
