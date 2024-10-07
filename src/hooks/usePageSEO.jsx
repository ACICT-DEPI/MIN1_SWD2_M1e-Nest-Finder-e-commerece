import { useEffect } from "react";

const usePageSEO = ({
    title,
    description,
    keywords = [],
    canonical // المتغير الجديد الخاص بـ canonical
}) => {
    useEffect(() => {
        document.title = title;
        setMetaTag('name', 'description', description);
        setMetaTag('name', 'keywords', keywords.join(', ')); // Convert array to string
        
        // إذا تم تمرير canonical، قم بإضافته
        if (canonical) {
            setCanonicalTag(canonical);
        }

        return () => {
            // يمكنك إضافة عمليات تنظيف هنا إذا لزم الأمر
        };
    }, [title, description, keywords, canonical]);

    const setMetaTag = (attr, key, content) => {
        if (content) {
            let element = document.querySelector(`meta[${attr}="${key}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, key);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        }
    };

    const setCanonicalTag = (href) => {
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', href);
    };
};

export default usePageSEO;


// import { useEffect } from "react";

// const usePageSEO = ({
//     title,
//     description,
//     keywords = [],
// }) => {
//     useEffect(() => {
//         document.title = title;
//         setMetaTag('name', 'description', description);
//         setMetaTag('name', 'keywords', keywords.join(', ')); // Convert array to string
//         return () => {
//             // يمكنك إضافة عمليات تنظيف هنا إذا لزم الأمر
//         };
//     }, [title, description, keywords]);

//     const setMetaTag = (attr, key, content) => {
//         if (content) {
//             let element = document.querySelector(`meta[${attr}="${key}"]`);
//             if (!element) {
//                 element = document.createElement('meta');
//                 element.setAttribute(attr, key);
//                 document.head.appendChild(element);
//             }
//             element.setAttribute('content', content);
//         }
//     };
// };

// export default usePageSEO;


