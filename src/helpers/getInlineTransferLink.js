export const getInlineTransferLink = (transferUrl) => {
  const chunks = transferUrl.split('/');
  return `${chunks[0]}/${chunks[1]}/${chunks[2]}/inline/${chunks[3]}/${chunks[4]}`;
};
