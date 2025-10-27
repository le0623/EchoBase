'use client';

import Image from 'next/image';
import { SubdomainForm } from '@/components/SubdomainForm';

export default function SetupTenantPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center bg-white">
        <Image
          src="/images/sign-hero.png"
          alt="Setup Tenant"
          width={916}
          height={909}
          className="w-full h-full object-contain"
          priority
          quality={100}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Right Side - Tenant Setup Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center min-h-[50vh] lg:min-h-screen max-h-screen overflow-y-auto">
        <div className="flex flex-col items-center w-full p-8 lg:p-12">
          <h2 className="text-4xl font-extrabold mb-3">Setup Your Organization</h2>
          <p className="body-md text-[#676767] mb-6">
            Create your organization workspace to get started with Echobase
          </p>

          {/* Use SubdomainForm for organization creation */}
          <SubdomainForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-[#676767]">
              You can change your organization settings later in the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
