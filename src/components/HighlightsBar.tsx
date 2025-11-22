import { useLocation } from "react-router-dom";
import { getHighlightsForPath } from "../content/highlights";

export function HighlightsBar() {
  const location = useLocation();
  const items = getHighlightsForPath(location.pathname);

  if (!items.length) {
    return null;
  }

  return (
    <div className="container highlights-wrapper">
      <ul className="highlights-scroll">
        {items.map((item) => (
          <li key={`${item.title}-${item.caption ?? item.href}`} className="highlight-item">
            <a className="highlight-pill" href={item.href}>
              <span className="highlight-circle">
                {item.icon ? (
                  <>
                    <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                    <span className="sr-only">{item.title}</span>
                  </>
                ) : (
                  item.title
                )}
              </span>
              {item.caption && (
                <span className="highlight-caption">{item.caption}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
