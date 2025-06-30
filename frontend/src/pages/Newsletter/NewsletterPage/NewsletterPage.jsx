import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom'; // --- CHANGE 1: Import hook ---
import './NewsletterPage.css';

import NewsletterHeader from '../NewsletterHeader/NewsletterHeader';
import Footer from '../../../components/Newsletter-components/Footer/Footer';
import SustainableFashion from '../SustainableFashion/SustainableFashion';
import LuxuryFashion from '../LuxuryFashion/LuxuryFashion';
import FastFashion from '../FastFashion/FastFashion';
import FashionSection from '../FashionSection/FashionSection';
import SneakersWorld from '../SneakersWorld/SneakersWorld';
import Background from '../../../components/Background/Background';

const NewsletterPage = () => {
  const [searchParams] = useSearchParams(); // --- CHANGE 2: Initialize hook ---

  const frontContentRef = useRef(null);
  const backContentRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState('100vh');

  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeFilter, setActiveFilter] = useState('default');
  const [showBack, setShowBack] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Data fetching useEffect remains the same
  useEffect(() => {
    const fetchArticles = async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/articles');
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        setAllArticles(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // --- CHANGE 3: Add useEffect for scrolling logic ---
  useEffect(() => {
    // Don't try to scroll until the page content has finished loading
    if (loading) return;

    const sectionToScroll = searchParams.get('section');
    if (sectionToScroll) {
      // Find the element by the ID we will add in renderSections
      const element = document.getElementById(`${sectionToScroll}-section`);
      if (element) {
        // Use a slight timeout to ensure the DOM has fully painted
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [loading, searchParams]); // Rerun this effect if loading status or URL params change

  // Other hooks and functions remain the same
  useEffect(() => {
    const measureHeight = () => {
      requestAnimationFrame(() => {
        const activeRef = showBack ? backContentRef : frontContentRef;
        if (activeRef.current) setContainerHeight(`${activeRef.current.offsetHeight}px`);
      });
    };
    measureHeight();
    window.addEventListener('resize', measureHeight);
    return () => window.removeEventListener('resize', measureHeight);
  }, [loading, activeFilter, showBack]);

  const handleFilterChange = useCallback((newFilter) => {
    if (isFlipping || newFilter === activeFilter) return;
    const isFlippingToBack = newFilter === 'domestic';
    const isFlippingToFront = activeFilter === 'domestic' && newFilter !== 'domestic';
    const needsPhysicalFlip = isFlippingToBack || isFlippingToFront;
    if (needsPhysicalFlip) {
      setIsFlipping(true);
      setShowBack(isFlippingToBack);
    }
    setTimeout(() => {
      setActiveFilter(newFilter);
      setIsFlipping(false);
    }, needsPhysicalFlip ? 600 : 50);
  }, [activeFilter, isFlipping]);

  const domesticContent = useMemo(() => allArticles.filter(a => a.location?.toLowerCase() === 'domestic'), [allArticles]);
  const internationalContent = useMemo(() => allArticles.filter(a => a.location?.toLowerCase() === 'international'), [allArticles]);
  const articlesForFrontFace = useMemo(() => activeFilter === 'international' ? internationalContent : allArticles, [activeFilter, internationalContent, allArticles]);

  // --- CHANGE 4: Modify renderSections to add an ID to each section's wrapper ---
  const renderSections = (articles) => {
    if (loading || !articles) return null;

    const sections = [
      { id: 'sustainable', Component: SustainableFashion, posts: articles.filter(p => p.category === 'SustainableFashion') },
      { id: 'luxury', Component: LuxuryFashion, posts: articles.filter(p => p.category === 'LuxuryFashion') },
      { id: 'fashion-feature', Component: FashionSection, post: articles.find(p => p.category === 'FashionFeature') },
      { id: 'fast', Component: FastFashion, posts: articles.filter(p => p.category === 'FastFashion') },
      { id: 'sneakers', Component: SneakersWorld, posts: articles.filter(p => p.category === 'SneakerWorld') },
    ];

    return sections.map(section => {
      const sectionId = `${section.id}-section`; // e.g., 'sustainable-section'
      
      if (section.id === 'fashion-feature') {
        return section.post ? <div id={sectionId} key={section.id}><section.Component post={section.post} /></div> : null;
      }
      if (!section.posts || section.posts.length === 0) return null;
      return <div id={sectionId} key={section.id}><section.Component posts={section.posts} /></div>;
    });
  };

  if (loading) return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '150px' }}>Loading...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center', marginTop: '150px' }}>Error: {error}</h2>;

  return (
    <div className="page-flip-container" style={{ height: containerHeight }}>
      <div className={`flip-card-inner ${showBack ? 'is-flipped' : ''}`}>
        <div className="flip-card-face flip-card-front">
          <div ref={frontContentRef} className="content-wrapper">
            <NewsletterHeader activeFilter={showBack ? '' : activeFilter} onFilterChange={handleFilterChange} isFlipping={isFlipping} />
            <div className="page-container">{renderSections(articlesForFrontFace)}</div>
          </div>
        </div>
        <div className="flip-card-face flip-card-back">
          <div ref={backContentRef} className="content-wrapper">
            <NewsletterHeader activeFilter={showBack ? 'domestic' : ''} onFilterChange={handleFilterChange} isFlipping={isFlipping} />
            <div className="page-container">{renderSections(domesticContent)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;