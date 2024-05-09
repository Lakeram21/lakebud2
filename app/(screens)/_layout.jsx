import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const ScreenLayout = () => {
  const { loading, isLogIn } = useGlobalContext();

  if (!loading && !isLogIn) return <Redirect href="/login" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="addExpense"
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="createBudget"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default ScreenLayout;