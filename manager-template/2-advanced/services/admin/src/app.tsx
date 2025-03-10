import AdminUI from "@interopio/manager-admin-ui";

const serverBase = "/server";
const base = process.env.REACT_APP_BASE;
const auth = "none";
const authUser = "admin"

const App = () => {
    console.log(`hello - ${serverBase}, ${base}`);

  return (
    <AdminUI
      agGridLicKey="CompanyName=TICK42 AD,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-013196,ExpiryDate=26_February_2022_[v2]_MTY0NTgzMzYwMDAwMA==a2171a628995068cf8578f7b431af74e"
      apiURL={serverBase}
      baseName={base}
      theme="dark"
      authUser={authUser}
      auth={auth}
      users={{ canAdd: true, havePasswords: true }}
    />
  );
};

export default App;
