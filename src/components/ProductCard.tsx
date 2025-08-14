import Link from 'next/link';
import Image from 'next/image';
import { WPProduct } from '../lib/wp';
import { formatExcerpt } from '../lib/utils';

export default function ProductCard({ product }: { product: WPProduct }) {
  const title = product.title.rendered.replace(/<[^>]+>/g, '');
  const excerpt = formatExcerpt(product.excerpt?.rendered || '', 22);
  const image = (product as any)?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const rating = product.acf?.rating ?? 0;
  return (
    <article className="card">
      {image && (
        <div className="card-img">
          <Image src={image} alt={title} width={400} height={260} />
        </div>
      )}
      <div className="card-body">
        <h3 className="card-title">
          <Link href={`/products/${product.slug}`}>{title}</Link>
        </h3>
        {rating > 0 && <div className="rating" aria-label={`Rating ${rating} out of 5`}>{'★'.repeat(rating)}{'☆'.repeat(5-rating)}</div>}
        <p className="excerpt">{excerpt}</p>
        <Link href={`/products/${product.slug}`} className="btn small">Read Review</Link>
      </div>
    </article>
  );
}
