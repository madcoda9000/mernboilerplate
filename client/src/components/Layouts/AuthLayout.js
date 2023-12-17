import { Flex, Stack, Image, useMediaQuery } from "@chakra-ui/react";
import DarkModeSwitcher from "../../components/shared/UI/DarkModeSwitcher";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import QuotesService from "../../Services/QuotesService";

const AuthLayout = ({ children }) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [quote, setQuote] = useState(null);
  const [aSettings, setAsettings] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("AppSettings")) {
      setAsettings(JSON.parse(localStorage.getItem("AppSettings")));
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
          <Flex p={8} flex={1} align={"top"} justify={"center"}>
            <Stack spacing={4} w={"full"} maxW={"md"}>
              <Outlet></Outlet>
              <Stack height={"100%"} alignContent={"center"} align={"center"}>
                <DarkModeSwitcher showSwitch={true} position={"absolute"} />
              </Stack>
            </Stack>
          </Flex>
          {isMobile ? (
            <></>
          ) : (
            <Flex flex={1}>
              <Image alt={"Login Image"} objectFit={"cover"} src={"images/bg.jpg"} />
              {quote && (
                <div className="blockquote-wrapper">
                  <div className="blockquote">
                    <h1>{quote.quote}</h1>
                    <h4>&mdash;&nbsp;{quote.author}</h4>
                  </div>
                </div>
              )}
            </Flex>
          )}
        </Stack>
      </div>
    </>
  );
};
export default AuthLayout;
