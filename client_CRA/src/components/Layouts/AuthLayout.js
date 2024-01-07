import { Flex, Stack, Image, useMediaQuery, Card, CardBody, Center } from "@chakra-ui/react";
import DarkModeSwitcher from "../../components/shared/UI/DarkModeSwitcher";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import QuotesService from "../../Services/QuotesService";

const AuthLayout = ({ children }) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("AppSettings")) {
      if (JSON.parse(localStorage.getItem("AppSettings")).showQuoteOfTheDay === "true") {
        QuotesService.getQuoteOfTheDay().then((response) => {
          if (!response.data.error) {
            setQuote(response.data.quote);
          }
        });
      }
    }
  }, []);

  return (
    <>
      <div className="authBody">
        <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
          {isMobile ? (
            <></>
          ) : (
            <Flex flex={1} bgColor={"defaultBg"}>
              {quote && (
                <Center width={"100%"}>
                  <div className="blockquote-wrapper">
                    <div className="blockquote">
                      <h1>{quote.quote}</h1>
                      <h4>&mdash;&nbsp;{quote.author}</h4>
                    </div>
                  </div>
                </Center>
              )}
            </Flex>
          )}
          <Flex p={8} flex={1} align={"center"} justify={"center"}>
            <Stack spacing={4} w={"full"} maxW={"md"}>
              <Card shadow={"lg"}>
                <CardBody>
                  <Outlet></Outlet>
                </CardBody>
              </Card>
              <Stack height={"100%"} alignContent={"center"} align={"center"}>
                <DarkModeSwitcher showSwitch={true} position={"absolute"} />
              </Stack>
            </Stack>
          </Flex>
        </Stack>
      </div>
    </>
  );
};
export default AuthLayout;
