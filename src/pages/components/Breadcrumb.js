import Link from 'next/link';

const Breadcrumb = ({ paths }) => {
    return (
        <nav className="text-sm mb-6">
            <ul className="flex space-x-2">
                {paths.map((path, index) => (
                    <li key={index} className="flex items-center">
                        <Link href={path.href} legacyBehavior>
                            <a className="text-blue-600 hover:underline">{path.label}</a>
                        </Link>
                        {index < paths.length - 1 && (
                            <span className="mx-2 text-gray-400">/</span>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Breadcrumb;
