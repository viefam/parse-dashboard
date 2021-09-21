export default ({
  data = null,
  columnDelimiter = ",",
  lineDelimiter = "\n"
}) => {
  let result, ctr, keys;
  console.log("Data", data);
  if (data === null || !data.length) {
    return null;
  }

  keys = Object.keys(data[0]);

  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(item => {
    ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) {
        result += columnDelimiter;
      }

      result +=
        typeof item[key] === "string" && item[key].includes(columnDelimiter)
          ? `"${item[key]}"`
          : item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
};

const dowloadCsv = (csvString, className) => {
  // Deliver to browser to download file
  const element = document.createElement("a");
  const file = new Blob([csvString], { type: "text/csv" });
  element.href = URL.createObjectURL(file);
  element.download = `${className}.csv`;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
};

export const DowloadCsv = dowloadCsv;
