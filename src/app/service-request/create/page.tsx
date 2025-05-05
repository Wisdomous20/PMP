import dynamic from 'next/dynamic';
// import LeftTab from "@/components/layouts/LeftTab";

const CreateServiceRequest = dynamic(
  () => import('@/components/service-request/CreateServiceRequest'),
  { ssr: false }
);

export default function Page() {
  return (
    <div className="w-screen h-screen flex bg-gradient-to-b from-yellow-50 to-blue-50">
      {/* <LeftTab /> */}
      <CreateServiceRequest />
    </div>
  )
}