import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



export default function DataProvider(){
    const client = new QueryClient()
    return(
        <QueryClientProvider client={client}>
            
        </QueryClientProvider>
    )
}
function useItems() {
  return useQuery("items", fetchItemsFunction);
}

function useItems() {
  return useQuery("items", fetchItemsFunction);
}

function useItems() {
  return useQuery("items", fetchItemsFunction);
}
