export const clearClientSession = async (queryClient) => {
  localStorage.removeItem("token");
  await queryClient.cancelQueries();
  queryClient.clear();
};
