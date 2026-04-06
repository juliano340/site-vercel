import Link from 'next/link';

const Breadcrumb = ({ paths }) => {
    return (
        <nav className="mb-6 text-sm">
            <ul className="flex flex-wrap items-center gap-2">
                {paths && paths.map((path, index) => (
                    <li key={index} className="flex items-center">
                        <Link href={path.href} legacyBehavior>
                            <a
                                className="mono-focus-ring transition-colors duration-200 hover:underline"
                                style={{ color: 'var(--color-muted)' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--color-accent)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--color-muted)';
                                }}
                            >
                                {path.label}
                            </a>
                        </Link>
                        {index < paths.length - 1 && (
                            <span className="mx-2" style={{ color: 'var(--color-dim)' }}>/</span>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Breadcrumb;
