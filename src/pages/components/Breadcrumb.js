import Link from 'next/link';

const Breadcrumb = ({ paths }) => {
    if (!paths || !Array.isArray(paths)) {
        console.error('Breadcrumb paths are not defined or not an array');
        return null;
    }

    return (
        <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex space-x-2">
                {paths.map((path, index) => (
                    <li key={index} className="flex items-center">
                        <Link href={path.href} legacyBehavior>
                            <a className="text-blue-600 hover:underline">{path.label}</a>
                        </Link>
                        {index < paths.length - 1 && (
                            <span className="mx-2 text-gray-500">/</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
