import UserNavbar from "../../components/UserNavbar";



export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
            <UserNavbar />
            <main style={{ flex: 1, padding: "1rem", overflowY: "auto", overflowX: "auto" }}>
                {children}
            </main>
        </div>
  );
}
