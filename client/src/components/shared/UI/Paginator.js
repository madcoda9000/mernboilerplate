import { Flex, Spacer, Box, Text, Button, Select, HStack } from "@chakra-ui/react";

const Paginator = (props) => {
  const totalPages = props.totalPages;
  const currentPage = props.currentPage;
  const nextPageMethod = props.nextPageMethod;
  const prevPageMethod = props.prevPageMethod;
  const totalItems = props.totalItems;
  const pageSize = props.pageSize;
  const changePageSize = props.pageSizeMethod;

  if (totalPages && currentPage && nextPageMethod && prevPageMethod) {
    return (
      <Flex>
        <HStack ml={"0px"}>
          <Box>
            <Text display={"inline"} ml={"22px"}>
              Showing{" "}
            </Text>
          </Box>
          <Box>
            <Select value={pageSize} size={"sm"} display={"inline"} onChange={(e) => changePageSize(e.target.value)}>
              <option value={"10"}>10</option>
              <option value={"20"}>20</option>
              <option value={"50"}>50</option>
              <option value={"100"}>100</option>
            </Select>
          </Box>
          <Box>
            <Text display={"inline"}> of {totalItems}</Text>
          </Box>
        </HStack>
        <Spacer />
        <Box>
          <Button mr={"20px"} size={"sm"} variant={"solid"} isDisabled={currentPage === "1" ? true : false} onClick={prevPageMethod}>
            Prev
          </Button>
          <Text display={"inline"} mr={"20px"}>
            Page {currentPage} of {totalPages}
          </Text>
          <Button mr={"21px"} size={"sm"} variant={"solid"} isDisabled={totalPages > currentPage ? false : true} onClick={nextPageMethod}>
            Next
          </Button>
        </Box>
      </Flex>
    );
  }
};

export default Paginator;
