import Image from 'next/image';

export default function SsoSignIn() {
  return (
    <>
      {/* Header */}
      <div className="text-center">
        <h3 className="mb-2 xl:text-2xl font-bold">Enterprise SSO</h3>
        <p>Sign in with your organization's identity provider</p>
      </div>

      {/* SSO Buttons */}
      <div className="space-y-5">
        <button className="w-full btn btn-secondary flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-100">
          <Image src="/images/icons/windows.svg" alt="Microsoft" width={24} height={24} />
          Continue with Microsoft Account
          <Image
            src="/images/icons/arrow-right.svg"
            alt="Arrow"
            width={24}
            height={24}
            className="ml-auto"
          />
        </button>

        <p className="text-center mt-2">
          Don't see your provider?{' '}
          <a href="#" className="text-primary-500 font-medium hover:underline">
            Contact your administrator
          </a>
        </p>

        {/* Footer Links */}
        <ul className="mt-10 flex flex-wrap justify-center gap-4 text-gray-200 [&_li_a]:font-medium [&_li_a]:text-gray-500 [&_li_a]:hover:text-gray-900 [&_li_a]:duration-150">
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Terms of Service</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Support</a>
          </li>
        </ul>
      </div>
    </>
  );
}
