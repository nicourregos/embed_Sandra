"use client"

import { useEffect, useState } from "react";

interface Props {
    setterCountry: (country: string) => void;
}

export default function Carrusel({
    setterCountry,
}: Props) {

    // Timeline Navigation Variables
    const [index, setIndex] = useState(7);
    let isAnimating = false;
    const FIXED_POSITION = 4;

    useEffect(() => {
        selectCard(7)
    }, []);

    /*    function createCardClones() {
           const timeline = document.getElementById('timeline');
           const cards = document.querySelectorAll('.timeline-card:not(.clone)');
           const totalCards = cards.length;
   
           // Removing any existing clones
           document.querySelectorAll('.timeline-card.clone').forEach(clone => {
               clone.parentNode?.removeChild(clone);
           });
   
           if (totalCards === 0) return;
   
           for (let i = 0; i < CLONES_PER_SIDE; i++) {
               const originalIndex = i % totalCards;
               const cardToClone = cards[originalIndex];
               const clone = cardToClone.cloneNode(true) as HTMLElement;
               clone.classList.add('clone');
               clone?.setAttribute('data-original-index', originalIndex.toString());
               timeline?.appendChild(clone);
   
               // Add event listener
               clone.addEventListener('click', () => {
                   if (!isAnimating) {
                       selectCard(originalIndex);
                   }
               });
           }
   
           for (let i = 0; i < CLONES_PER_SIDE; i++) {
               const originalIndex = (totalCards - 1 - i) % totalCards;
               const cardToClone = cards[originalIndex];
               const clone = cardToClone.cloneNode(true) as HTMLElement;
               clone.classList.add('clone');
               clone.setAttribute('data-original-index', originalIndex.toString());
               timeline?.insertBefore(clone, timeline.firstChild);
   
               clone.addEventListener('click', () => {
                   if (!isAnimating) {
                       selectCard(originalIndex);
                   }
               });
           }
       } */

    function initTimeline() {
        // Getting all cards
        const cards = document.querySelectorAll('.timeline-card');

        // Removing active class from all cards temporarily
        cards.forEach(card => {
            card.classList.remove('active', 'blurred');
            // Hide detailed content initially
            const detailedContent = card.querySelector('.detailed-content') as HTMLElement;
            if (detailedContent) {
                detailedContent.style.display = 'none';
            }
        });

        // Creating card clones for infinite effect
        //createCardClones();

        // Add click event to all original cards
        document.querySelectorAll('.timeline-card:not(.clone)').forEach((card, index) => {
            card.addEventListener('click', () => {
                if (!card.classList.contains('active') && !isAnimating) {
                    selectCard(index);
                }
            });
        });

        setTimeout(() => {
            selectCard(index, true);
        }, 100);
    }

    function selectCard(newIndex: number, isInitial = false) {
        if (isAnimating && !isInitial) return;

        isAnimating = true;

        // Closing any open panels first
        resetExpandedElements();

        // Getting all original cards (not clones)
        const originalCards = document.querySelectorAll('.timeline-card:not(.clone)') as NodeListOf<HTMLElement>;
        const allCards = document.querySelectorAll('.timeline-card') as NodeListOf<HTMLElement>;

        // First, removing active class from all cards but keep them visible
        allCards.forEach(card => {
            card.classList.remove('active', 'blurred');
            card.style.opacity = '0.7';

            // Hiding any open detailed content
            const detailedContent = card.querySelector('.detailed-content') as HTMLElement;
            if (detailedContent) {
                detailedContent.style.display = 'none';
            }
        });

        // Marking the new card as transitioning (but not yet active)
        const selectedCard = originalCards[newIndex];

        // Also updating the corresponding clone cards
        const clonesToUpdate = document.querySelectorAll(`.timeline-card.clone[data-original-index="${newIndex}"]`) as NodeListOf<HTMLElement>;

        // Starting the animation to move the timeline
        moveTimelineToPosition(isInitial);

        // After the timeline animation is complete, activate the card
        setTimeout(() => {
            // Apply active class to selected card
            selectedCard.classList.add('active');
            selectedCard.style.opacity = '1';

            // Update clones
            clonesToUpdate.forEach(clone => {
                clone.classList.add('active');
                clone.style.opacity = '1';
            });

            // Adding blurred class to appropriately positioned cards
            applyBlurredEffect(originalCards);

            // Showing detailed content with a fade-in effect
            const detailedContent = selectedCard.querySelector('.detailed-content') as HTMLElement;
            if (detailedContent) {
                detailedContent.style.display = 'block';
                detailedContent.style.opacity = '0';

                // Triggering reflow to ensure animation works
                void detailedContent.offsetWidth;

                // Fade in the detailed content
                detailedContent.style.transition = 'opacity 0.5s ease-in-out';
                detailedContent.style.opacity = '1';
            }

            adjustArrowsPosition();

            isAnimating = false;
        }, isInitial ? 100 : 700);
        // Updating current index
        setIndex(newIndex);
    }

    function applyBlurredEffect(cards: NodeListOf<HTMLElement>) {

        cards.forEach((card, subindex) => {
            const distance = Math.abs(subindex - index);

            // Applying blurred effect to cards that are far away
            if (distance > 3) {
                card.classList.add('blurred');
            }

            // Also blurring clones that represent cards far from the current selection
            const clones = document.querySelectorAll(`.timeline-card.clone[data-original-index="${subindex}"]`);
            if (distance > 3) {
                clones.forEach(clone => clone.classList.add('blurred'));
            }
        });
    }

    function moveTimelineToPosition(isInitial = false) {
        const timeline = document.getElementById('timeline');
        const container = document.querySelector('.timeline-container');
        const cards = document.querySelectorAll('.timeline-card:not(.clone)');

        if (!timeline || !container || cards.length === 0) return;

        // Getting dimensions
        const containerRect = container.getBoundingClientRect();

        // Accounting for the clone cards when calculating position
        const selectedCard = cards[index];
        const selectedCardRect = selectedCard?.getBoundingClientRect();

        // Calculating card width and spacing
        const cardWidth = (selectedCard as HTMLElement).offsetWidth;
        const cardMargin = parseInt(window.getComputedStyle(selectedCard).marginRight) || 10;
        const cardSpacing = cardWidth + (cardMargin * 2);

        // Calculating the center point where we want the selected card to be
        const containerCenter = containerRect.left + (containerRect.width / 2);

        // Calculating position offset to place selected card at FIXED_POSITION
        const targetPositionOffset = (FIXED_POSITION - Math.floor(cards.length / 2)) * cardSpacing;
        const targetPositionPx = containerCenter + targetPositionOffset;

        // Current position of the selected card
        const currentPositionPx = selectedCardRect.left + (cardWidth / 2);

        // Calculating how far we need to move the timeline
        const moveDistance = targetPositionPx - currentPositionPx;

        // Getting current transform value
        const currentTransform = window.getComputedStyle(timeline).getPropertyValue('transform');
        let currentTranslateX = 0;

        if (currentTransform !== 'none') {
            // Extracting current translateX value
            const matrix = new DOMMatrix(currentTransform);
            currentTranslateX = matrix.m41;
        }

        // Calculating new position
        const newTranslateX = currentTranslateX + moveDistance;

        // Applying the transform with or without animation
        if (isInitial) {
            // For initial positioning, no animation
            timeline.style.transition = 'none';
            timeline.style.transform = `translateX(${newTranslateX}px)`;
            // Force reflow
            void timeline.offsetWidth;
            timeline.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        } else {
            // For user interaction, apply smooth animation
            timeline.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            timeline.style.transform = `translateX(${newTranslateX}px)`;
        }
    }

    function scrollLeft() {
        if (!isAnimating) {
            const cards = document.querySelectorAll('.timeline-card:not(.clone)');
            // Move to previous card, with wraparound for infinite scrolling
            const prevIndex = (index - 1 + cards.length) % cards.length;
            selectCard(prevIndex);
        }
    }

    function scrollRight() {
        if (!isAnimating) {
            const cards = document.querySelectorAll('.timeline-card:not(.clone)');
            // Move to next card, with wraparound for infinite scrolling
            const nextIndex = (index + 1) % cards.length;
            selectCard(nextIndex);
        }
    }

    useEffect(() => {
        // Tracking window scroll to keep arrows at the right position
        window.addEventListener('scroll', function () {
            adjustArrowsPosition();
        });
        // Adding global click handler to close panels when clicking outside
        document.addEventListener('click', function (event) {
            const activeCard = document.querySelector('.timeline-card.active');
            if (!activeCard) return;

            const year = activeCard.getAttribute('data-year');
            const e = event.target as Element

            if (!e?.closest('.expandable-panel') &&
                !e?.closest('.role') &&
                !e?.closest('.section-title') &&
                !e?.closest('.achievement-item')) {

                if (!e?.closest('.role')) {
                    const roleBox = document.getElementById(`director-role-${year}`);
                    const roleArrow = document.getElementById(`role-arrow-${year}`);
                    const rolePanel = document.getElementById(`role-details-panel-${year}`);

                    if (roleBox) roleBox.classList.remove('expanded');
                    if (roleArrow) roleArrow.classList.add('right');
                    if (rolePanel) rolePanel.classList.remove('active');
                }

                if (!e.closest('.section-title')) {
                    const leadershipContent = document.getElementById(`leadership-content-${year}`);
                    const leadershipArrow = document.getElementById(`leadership-arrow-${year}`);

                    if (leadershipContent) leadershipContent.classList.remove('expanded');
                    if (leadershipArrow) leadershipArrow.classList.add('right');
                }

                document.querySelectorAll(`.achievement-item[id*="-${year}"]`).forEach(item => {
                    item.classList.remove('active');
                    (item as HTMLElement).style.marginTop = '';
                    (item as HTMLElement).style.marginBottom = '';
                });

                document.querySelectorAll(`.achievement-item[id*="-${year}"] .section-title-arrow`).forEach(arrow => {
                    arrow.classList.add('right');
                });

                document.querySelectorAll(`.expandable-panel[id*="-${year}"]`).forEach(panel => {
                    if (panel.id !== `role-details-panel-${year}` && panel.id !== `leadership-panel-${year}`) {
                        panel.classList.remove('active');
                    }
                });
            }
        });

        // Initializing everything when the document is ready
        document.addEventListener('DOMContentLoaded', () => {
            initTimeline();
            initializeAllLeadershipSections();

            // Making toggle functions available globally
            /* window.toggleRole = toggleRole;
            window.toggleLeadership = toggleLeadership;
            window.toggleAchievement = toggleAchievement;
            window.positionPanelWithAchievement = positionPanelWithAchievement;
            window.checkAndAdjustPanelOverlaps = checkAndAdjustPanelOverlaps;
            window.validateAllPanelPositions = validateAllPanelPositions; */
        });

        // Adding CSS directly in JavaScript to ensure proper transitions
        document.addEventListener('DOMContentLoaded', function () {
            // Creating a style element
            const style = document.createElement('style');

            // Adding custom animation styles
            style.textContent = `
            .timeline-card {
                transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), 
                            opacity 0.5s ease-in-out;
            }
            
            .timeline-card.active {
                opacity: 1;
                transform: scale(1.2);
                z-index: 30;
                height: auto;
            }
            
            .timeline-card:not(.active) {
                opacity: 0.7;
                transform: scale(1);
            }
            
            .timeline-card:not(.active):hover {
                opacity: 0.9;
                transform: scale(1.05);
                transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), 
                            opacity 0.3s ease-in-out;
            }
            
            .timeline-card.blurred {
                opacity: 0.3;
            }
            
            .detailed-content {
                transition: opacity 0.5s ease-in-out;
            }
            
            / * Clone card styles * /
            .timeline-card.clone {
                opacity: 0.7;
            }
            
            / * Improved arrow buttons * /
            .scroll-arrow {
                transform: translateY(-50%);
                transition: background-color 0.3s ease, transform 0.2s ease;
            }
            
            .scroll-arrow:hover {
                background-color: #003380;
                transform: translateY(-50%) scale(1.1);
            }
            
            .scroll-arrow:active {
                transform: translateY(-50%) scale(0.95);
            }
            
            /* Expandable panel animation and positioning improvements * /
            .expandable-panel {
                transition: opacity 0.5s ease-in-out, visibility 0.5s, top 0.5s ease;
                opacity: 0;
                visibility: hidden;
                z-index: 0;
            }
            
            .expandable-panel.active {
                opacity: 1;
                visibility: visible;
                z-index: 20;
            }
            
            .achievement-item {
                transition: margin-top 0.3s ease, margin-bottom 0.3s ease;
            }
            
            .achievement-item.active .achievement-text {
                margin-top: 80px;
                margin-bottom: 80px;
            }
            
            .achievement-item.active .achievement-bullet {
                margin-top: 80px;
                margin-bottom: 80px;
            }
        `;

            document.head.appendChild(style);
        });
    }, []);

    function adjustArrowsPosition() {
        // Finding the active card's center
        const activeCard = document.querySelector('.timeline-card.active');
        if (!activeCard) return;

        const cardRect = activeCard.getBoundingClientRect();
        const cardCenterY = cardRect.top + (cardRect.height / 2);

        // Adjusting the arrows to align with the card's center
        const arrows = document.querySelectorAll('.scroll-arrow') as NodeListOf<HTMLElement>;
        arrows.forEach(arrow => {
            arrow.style.top = `${cardCenterY}px`;
            arrow.style.transform = 'translateY(-50%)'; // Center arrow on this point
        });
    }

    function resetExpandedElements() {
        // Closing all expandable panels
        document.querySelectorAll('.expandable-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Resetting all role containers
        document.querySelectorAll('.role').forEach(role => {
            role.classList.remove('expanded');
        });

        // Resetting all arrows
        document.querySelectorAll('.role-arrow, .section-title-arrow').forEach(arrow => {
            arrow.classList.add('right');
        });

        // Resetting all leadership content
        document.querySelectorAll('.leadership-content').forEach(content => {
            content.classList.remove('expanded');
        });

        // Resetting all achievement items
        document.querySelectorAll('.achievement-item').forEach(item => {
            item.classList.remove('active');
            (item as HTMLElement).style.marginTop = '';
            (item as HTMLElement).style.marginBottom = '';
        });
    }

    // Expandable content functions
    function toggleRole(year: number) {
        const director = document.getElementById(`director-role-${year}`);
        const content = document.getElementById(`role-content-${year}`);
        const arrow = document.getElementById(`role-arrow-${year}`);

        if (!content || !arrow || !director) return;

        director.classList.toggle('expanded');
        content.classList.toggle('expanded');
        arrow.classList.toggle('right');

        // Repositioning achievement panels if needed
        setTimeout(validateAllPanelPositions, 300);
    }

    function toggleLeadership(year: number) {
        const content = document.getElementById(`leadership-content-${year}`);
        const arrow = document.getElementById(`leadership-arrow-${year}`);

        if (!content || !arrow) return;

        content.classList.toggle('expanded');
        arrow.classList.toggle('right');

        // Repositioning achievement panels if needed
        setTimeout(validateAllPanelPositions, 300);
    }

    function toggleAchievements(year: string) {
        const content = document.getElementById(`achievement-content-${year}`);
        const arrow = document.getElementById(`achievement-arrow-${year}`);

        if (!content || !arrow) return;

        content.classList.toggle('expanded');
        arrow.classList.toggle('right');

        // Repositioning achievement panels if needed
        setTimeout(validateAllPanelPositions, 300);
    }

    function initializeAllLeadershipSections() {
        // Making sure all leadership sections start collapsed
        const years = [2003, 2007, 2010, 2013, 2014, 2018, 2020, 2021];

        years.forEach(year => {
            const content = document.getElementById(`leadership-content-${year}`);
            const arrow = document.getElementById(`leadership-arrow-${year}`);

            if (content && arrow) {
                // Ensuring it starts collapsed
                content.classList.remove('expanded');
                arrow.classList.add('right');

                // Adding explicit click handler to ensure it works
                const titleElement = document.querySelector(`.section-title[]`);
                if (titleElement) {
                    titleElement.removeAttribute('onclick');

                    // Add event listener directly
                    titleElement.addEventListener('click', function () {
                        toggleLeadership(year);
                    });
                }
            }
        });
    }

    /* function toggleAchievement(panelId: string, arrowId: string, itemId: string) {
        const arrow = document.getElementById(arrowId);
        const achievementItem = document.getElementById(itemId);
        const panel = document.getElementById(panelId);

        if (!panel || !arrow || !achievementItem) return;

        achievementItem.classList.toggle('active');
        arrow.classList.toggle('right');

        // Getting all achievement items in the same card
        const card = achievementItem.closest('.timeline-card') as HTMLElement;
        const allAchievements = card.querySelectorAll('.achievement-item');

        if (achievementItem.classList.contains('active')) {
            // Adding margin to selected achievement
            achievementItem.style.marginTop = '80px';
            achievementItem.style.marginBottom = '80px';

            // Resetting margins for other achievements
            allAchievements.forEach(item => {
                if (item !== achievementItem) {
                    (item as HTMLElement).style.marginTop = '';
                    (item as HTMLElement).style.marginBottom = '';
                }
            });

            panel.classList.add('active');

            setTimeout(() => {
                positionPanelWithAchievement(panel, achievementItem);
                setTimeout(validateAllPanelPositions, 50);
            }, 150);
        } else {
            panel.classList.remove('active');
            achievementItem.style.marginTop = '';
            achievementItem.style.marginBottom = '';

            setTimeout(validateAllPanelPositions, 150);
        }

        // Adjusting card height
        if (card) {
            setTimeout(() => {
                const cardHeight = card.scrollHeight;
                card.style.minHeight = Math.max(553, cardHeight) + 'px';
            }, 300);
        }
    } */

    function checkAndAdjustPanelOverlaps() {
        const activePanels = Array.from(document.querySelectorAll('.expandable-panel.active'))
            .filter(panel => panel.id.includes('achievement')) as HTMLElement[];

        if (activePanels.length <= 1) return;

        activePanels.sort((a, b) => parseInt(a.style.top) - parseInt(b.style.top));

        for (let i = 1; i < activePanels.length; i++) {
            const previousPanel = activePanels[i - 1];
            const currentPanel = activePanels[i];

            const previousBottom = parseInt(previousPanel.style.top) + previousPanel.offsetHeight;
            const currentTop = parseInt(currentPanel.style.top);

            const minimumGap = 60;
            if (previousBottom + minimumGap > currentTop) {
                currentPanel.style.top = `${previousBottom + minimumGap}px`;
            }
        }
    }

    function validateAllPanelPositions() {
        const activeAchievements = document.querySelectorAll('.achievement-item.active');

        activeAchievements.forEach(item => {
            const panelId = item.getAttribute('data-panel');
            const panel = document.getElementById(panelId ?? "");

            if (panel && panel.classList.contains('active')) {
                const itemRect = item.getBoundingClientRect();
                const cardRect = item.closest('.timeline-card')?.getBoundingClientRect();
                const centerY = itemRect.top + (itemRect.height / 2) - (cardRect?.top ?? 0);
                panel.style.top = `${centerY - (panel.offsetHeight / 2)}px`;
            }
        });

        checkAndAdjustPanelOverlaps();
        setTimeout(checkAndAdjustPanelOverlaps, 50);
    }

    return (
        <>
            <div className="scroll-arrow left-arrow" onClick={scrollLeft}>←</div>
            <div className="scroll-arrow right-arrow" onClick={scrollRight}>→</div>
            <div className="timeline-container pb-4">
                <div className="blur-overlay blur-left"></div>
                <div className="blur-overlay blur-right"></div>

                <div className="timeline-wrapper" id="timeline">

                    <div className="timeline-card" data-year="2001" data-location="Colombia">
                        <div className="compact-content" onClick={() => { setterCountry("Colombia"); selectCard(0); }}>
                            <div className="year">2001</div>
                            <div className="status">- 2005</div>
                            <div className="logo-container">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Senvion Logo" className="image" />
                            </div>
                            <div className="card-location">Medellín, Colombia </div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2001</div>
                                    <div className="status">- 2005</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2001" className="role" >
                                    Junior Research Engineer<span id="role-arrow-2001" className="role-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleRole(2001)}>▾</span>
                                </div>
                                <div className="department">Department of Chemical Engineering.</div>
                                <div id="role-content-2001" className="achievement-content">
                                    <div className="ml-4">
                                        <div className="panel-section">
                                            <h4>What did I do?:</h4>
                                            <p>Advance research and development of green and clean technologies by optimizing industrial processes for water reuse and by incorporating industrial sludge into high-value products. This entailed conducting lab-scale experiments, coordinating industrial-level tests, and applying simulation and design tools to ensure efficient, sustainable outcomes.</p>
                                        </div>
                                        <div className="panel-section">
                                            <h4>How did I do it?:</h4>
                                            <p>Successfully repurposing paper industry sludge into eco-friendly ceramic bricks. Through extensive lab tests and subsequent industrial-scale trials, I demonstrated that these residual materials could be effectively integrated into brick production, resulting in environmentally responsible and economically feasible building solutions.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2001" className="achievement-item"
                                    data-panel="achievement1-panel-2001"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Innovative Water Reuse Implementations
                                        <span id="achievement-arrow-2001-1" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2001-1")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2001-1" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Successfully evaluated and integrated water reuse solutions across various industrial sectors, including tannery, galvanic, beef, and textiles.</p>
                                    </div>
                                </div>
                                <div id="achievement2-2001" className="achievement-item"
                                    data-panel="achievement2-panel-2001"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Industrial Sludge Recycling
                                        <span id="achievement-arrow-2001-2" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2001-2")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2001-2" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Developed novel methods for recycling paper-industry sludge, transforming waste materials into ceramic products and lightweight aggregates for construction.</p>
                                    </div>
                                </div>
                                <div id="achievement3-2001" className="achievement-item"
                                    data-panel="achievement3-panel-2001"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Process Optimization & Scale-Up
                                        <span id="achievement-arrow-2001-3" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2001-3")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2001-3" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Employed computerized experimental designs to optimize synthesis protocols, leading to industrial-level testing and practical adoption of lightweight aggregates.</p>
                                    </div>
                                </div>
                                <div id="achievement4-2001" className="achievement-item"
                                    data-panel="achievement4-panel-2001"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Energy-Efficient Process Simulation
                                        <span id="achievement-arrow-2001-4" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2001-4")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2001-4" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Modeled a lightweight aggregate process with an integrated heat recycling system, demonstrating potential energy savings and sustainable practices.</p>
                                    </div>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills fixed bottom-0 rounded-b-[20px]">
                                <div className="skills-title">Skills <span id="skills-arrow" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card" data-year="2017" data-location="Australia">
                        <div className="compact-content" onClick={() => { setterCountry("Australia"); selectCard(1); }}>
                            <div className="year">2017</div>
                            <div className="status">- 2019</div>
                            <div className="logo-container">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Senvion Logo" className="image" />
                            </div>
                            <div className="card-location">Melbourne, Australia</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2017</div>
                                    <div className="status">- 2019</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2017" className="role" >
                                    Commercial and Contract Manager <span id="role-arrow-2017" className="role-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleRole(2017)}>▾</span>
                                </div>
                                <div className="department">of Wind Energy Projects.</div>
                                <div id="role-content-2017" className="achievement-content">
                                    <div className="ml-4">
                                        <div className="panel-section">
                                            <h4>What did I do?:</h4>
                                            <p>Maximize the profitability and success of wind farm projects by overseeing commercial and contractual aspects, from bidding strategies and cost analysis to contract negotiation. Ensure alignment with organizational goals and compliance, supporting the Australian Sales Team to secure and deliver profitable, operationally sound projects.</p>
                                        </div>
                                        <div className="panel-section">
                                            <h4>How did I do it?:</h4>
                                            <p>I developed a comparative tool that standardized commercial metrics across potential projects. This innovation enabled the team and the Board of Directors to objectively assess and decide whether to proceed with the EPC contract for a given wind farm, ultimately strengthening the decision-making process.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2017" className="achievement-item"
                                    data-panel="achievement1-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Secured Profitable Contracts
                                        <span id="achievement-arrow-2017-1" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-1")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-1" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Led the negotiation of multiple wind farm project contracts, ensuring favorable terms and maximizing profitability.</p>
                                    </div>
                                </div>
                                <div id="achievement2-2017" className="achievement-item"
                                    data-panel="achievement2-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Optimized Bidding Strategies
                                        <span id="achievement-arrow-2017-2" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-2")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-2" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Developed and refined bidding strategies that integrated accurate cost inputs, financial modeling, and risk assessments, resulting in successful tender outcomes.</p>
                                    </div>
                                </div>
                                <div id="achievement3-2017" className="achievement-item"
                                    data-panel="achievement3-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Enhanced Data-Driven Decision-Making
                                        <span id="achievement-arrow-2017-3" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-3")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-3" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Implemented detailed pricing analyses and financial evaluations, enabling the leadership team to make informed decisions regarding project viability.</p>
                                    </div>
                                </div>
                                <div id="achievement4-2017" className="achievement-item"
                                    data-panel="achievement4-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Streamlined Approval Processes
                                        <span id="achievement-arrow-2017-4" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-4")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-4" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Coordinated cross-functional reviews and internal approvals, reducing turnaround time and aligning stakeholders prior to Board engagement.</p>
                                    </div>
                                </div>
                                <div id="achievement5-2017" className="achievement-item"
                                    data-panel="achievement5-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Improved Risk Management
                                        <span id="achievement-arrow-2017-5" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-5")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-5" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Oversaw insurance and bonding arrangements, mitigating financial and operational risks while maintaining compliance with industry standards.</p>
                                    </div>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills fixed bottom-0 rounded-b-[20px]">
                                <div className="skills-title">Skills <span id="skills-arrow" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card" data-year="2017" data-location="Australia">
                        <div className="compact-content" onClick={() => { setterCountry("Australia"); selectCard(2); }}>
                            <div className="year">2017</div>
                            <div className="status">- 2019</div>
                            <div className="logo-container">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Senvion Logo" className="image" />
                            </div>
                            <div className="card-location">Melbourne, Australia</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2017</div>
                                    <div className="status">- 2019</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2017" className="role" >
                                    Commercial and Contract Manager <span id="role-arrow-2017" className="role-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleRole(2017)}>▾</span>
                                </div>
                                <div className="department">of Wind Energy Projects.</div>
                                <div id="role-content-2017" className="achievement-content">
                                    <div className="ml-4">
                                        <div className="panel-section">
                                            <h4>What did I do?:</h4>
                                            <p>Maximize the profitability and success of wind farm projects by overseeing commercial and contractual aspects, from bidding strategies and cost analysis to contract negotiation. Ensure alignment with organizational goals and compliance, supporting the Australian Sales Team to secure and deliver profitable, operationally sound projects.</p>
                                        </div>
                                        <div className="panel-section">
                                            <h4>How did I do it?:</h4>
                                            <p>I developed a comparative tool that standardized commercial metrics across potential projects. This innovation enabled the team and the Board of Directors to objectively assess and decide whether to proceed with the EPC contract for a given wind farm, ultimately strengthening the decision-making process.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2017" className="achievement-item"
                                    data-panel="achievement1-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Secured Profitable Contracts
                                        <span id="achievement-arrow-2017-1" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-1")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-1" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Led the negotiation of multiple wind farm project contracts, ensuring favorable terms and maximizing profitability.</p>
                                    </div>
                                </div>
                                <div id="achievement2-2017" className="achievement-item"
                                    data-panel="achievement2-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Optimized Bidding Strategies
                                        <span id="achievement-arrow-2017-2" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-2")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-2" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Developed and refined bidding strategies that integrated accurate cost inputs, financial modeling, and risk assessments, resulting in successful tender outcomes.</p>
                                    </div>
                                </div>
                                <div id="achievement3-2017" className="achievement-item"
                                    data-panel="achievement3-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Enhanced Data-Driven Decision-Making
                                        <span id="achievement-arrow-2017-3" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-3")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-3" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Implemented detailed pricing analyses and financial evaluations, enabling the leadership team to make informed decisions regarding project viability.</p>
                                    </div>
                                </div>
                                <div id="achievement4-2017" className="achievement-item"
                                    data-panel="achievement4-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Streamlined Approval Processes
                                        <span id="achievement-arrow-2017-4" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-4")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-4" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Coordinated cross-functional reviews and internal approvals, reducing turnaround time and aligning stakeholders prior to Board engagement.</p>
                                    </div>
                                </div>
                                <div id="achievement5-2017" className="achievement-item"
                                    data-panel="achievement5-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Improved Risk Management
                                        <span id="achievement-arrow-2017-5" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-5")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-5" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Oversaw insurance and bonding arrangements, mitigating financial and operational risks while maintaining compliance with industry standards.</p>
                                    </div>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills fixed bottom-0 rounded-b-[20px]">
                                <div className="skills-title">Skills <span id="skills-arrow" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card" data-year="2017" data-location="Australia">
                        <div className="compact-content" onClick={() => { setterCountry("Australia"); selectCard(3); }}>
                            <div className="year">2017</div>
                            <div className="status">- 2019</div>
                            <div className="logo-container">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Senvion Logo" className="image" />
                            </div>
                            <div className="card-location">Melbourne, Australia</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2017</div>
                                    <div className="status">- 2019</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2017" className="role" >
                                    Commercial and Contract Manager <span id="role-arrow-2017" className="role-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleRole(2017)}>▾</span>
                                </div>
                                <div className="department">of Wind Energy Projects.</div>
                                <div id="role-content-2017" className="achievement-content">
                                    <div className="ml-4">
                                        <div className="panel-section">
                                            <h4>What did I do?:</h4>
                                            <p>Maximize the profitability and success of wind farm projects by overseeing commercial and contractual aspects, from bidding strategies and cost analysis to contract negotiation. Ensure alignment with organizational goals and compliance, supporting the Australian Sales Team to secure and deliver profitable, operationally sound projects.</p>
                                        </div>
                                        <div className="panel-section">
                                            <h4>How did I do it?:</h4>
                                            <p>I developed a comparative tool that standardized commercial metrics across potential projects. This innovation enabled the team and the Board of Directors to objectively assess and decide whether to proceed with the EPC contract for a given wind farm, ultimately strengthening the decision-making process.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2017" className="achievement-item"
                                    data-panel="achievement1-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Secured Profitable Contracts
                                        <span id="achievement-arrow-2017-1" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-1")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-1" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Led the negotiation of multiple wind farm project contracts, ensuring favorable terms and maximizing profitability.</p>
                                    </div>
                                </div>
                                <div id="achievement2-2017" className="achievement-item"
                                    data-panel="achievement2-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Optimized Bidding Strategies
                                        <span id="achievement-arrow-2017-2" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-2")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-2" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Developed and refined bidding strategies that integrated accurate cost inputs, financial modeling, and risk assessments, resulting in successful tender outcomes.</p>
                                    </div>
                                </div>
                                <div id="achievement3-2017" className="achievement-item"
                                    data-panel="achievement3-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Enhanced Data-Driven Decision-Making
                                        <span id="achievement-arrow-2017-3" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-3")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-3" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Implemented detailed pricing analyses and financial evaluations, enabling the leadership team to make informed decisions regarding project viability.</p>
                                    </div>
                                </div>
                                <div id="achievement4-2017" className="achievement-item"
                                    data-panel="achievement4-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Streamlined Approval Processes
                                        <span id="achievement-arrow-2017-4" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-4")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-4" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Coordinated cross-functional reviews and internal approvals, reducing turnaround time and aligning stakeholders prior to Board engagement.</p>
                                    </div>
                                </div>
                                <div id="achievement5-2017" className="achievement-item"
                                    data-panel="achievement5-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Improved Risk Management
                                        <span id="achievement-arrow-2017-5" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-5")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-5" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Oversaw insurance and bonding arrangements, mitigating financial and operational risks while maintaining compliance with industry standards.</p>
                                    </div>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills fixed bottom-0 rounded-b-[20px]">
                                <div className="skills-title">Skills <span id="skills-arrow" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card" data-year="2017" data-location="Australia">
                        <div className="compact-content" onClick={() => { setterCountry("Australia"); selectCard(1); }}>
                            <div className="year">2017</div>
                            <div className="status">- 2019</div>
                            <div className="logo-container">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Senvion Logo" className="image" />
                            </div>
                            <div className="card-location">Melbourne, Australia</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2017</div>
                                    <div className="status">- 2019</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2017" className="role" >
                                    Commercial and Contract Manager <span id="role-arrow-2017" className="role-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleRole(2017)}>▾</span>
                                </div>
                                <div className="department">of Wind Energy Projects.</div>
                                <div id="role-content-2017" className="achievement-content">
                                    <div className="ml-4">
                                        <div className="panel-section">
                                            <h4>What did I do?:</h4>
                                            <p>Maximize the profitability and success of wind farm projects by overseeing commercial and contractual aspects, from bidding strategies and cost analysis to contract negotiation. Ensure alignment with organizational goals and compliance, supporting the Australian Sales Team to secure and deliver profitable, operationally sound projects.</p>
                                        </div>
                                        <div className="panel-section">
                                            <h4>How did I do it?:</h4>
                                            <p>I developed a comparative tool that standardized commercial metrics across potential projects. This innovation enabled the team and the Board of Directors to objectively assess and decide whether to proceed with the EPC contract for a given wind farm, ultimately strengthening the decision-making process.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2017" className="achievement-item"
                                    data-panel="achievement1-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Secured Profitable Contracts
                                        <span id="achievement-arrow-2017-1" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-1")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-1" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Led the negotiation of multiple wind farm project contracts, ensuring favorable terms and maximizing profitability.</p>
                                    </div>
                                </div>
                                <div id="achievement2-2017" className="achievement-item"
                                    data-panel="achievement2-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Optimized Bidding Strategies
                                        <span id="achievement-arrow-2017-2" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-2")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-2" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Developed and refined bidding strategies that integrated accurate cost inputs, financial modeling, and risk assessments, resulting in successful tender outcomes.</p>
                                    </div>
                                </div>
                                <div id="achievement3-2017" className="achievement-item"
                                    data-panel="achievement3-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Enhanced Data-Driven Decision-Making
                                        <span id="achievement-arrow-2017-3" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-3")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-3" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Implemented detailed pricing analyses and financial evaluations, enabling the leadership team to make informed decisions regarding project viability.</p>
                                    </div>
                                </div>
                                <div id="achievement4-2017" className="achievement-item"
                                    data-panel="achievement4-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Streamlined Approval Processes
                                        <span id="achievement-arrow-2017-4" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-4")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-4" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Coordinated cross-functional reviews and internal approvals, reducing turnaround time and aligning stakeholders prior to Board engagement.</p>
                                    </div>
                                </div>
                                <div id="achievement5-2017" className="achievement-item"
                                    data-panel="achievement5-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Improved Risk Management
                                        <span id="achievement-arrow-2017-5" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-5")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-5" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Oversaw insurance and bonding arrangements, mitigating financial and operational risks while maintaining compliance with industry standards.</p>
                                    </div>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills fixed bottom-0 rounded-b-[20px]">
                                <div className="skills-title">Skills <span id="skills-arrow" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card" data-year="2017" data-location="Australia">
                        <div className="compact-content" onClick={() => { setterCountry("Australia"); selectCard(5); }}>
                            <div className="year">2017</div>
                            <div className="status">- 2019</div>
                            <div className="logo-container">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Senvion Logo" className="image" />
                            </div>
                            <div className="card-location">Melbourne, Australia</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2017</div>
                                    <div className="status">- 2019</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2017" className="role" >
                                    Commercial and Contract Manager <span id="role-arrow-2017" className="role-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleRole(2017)}>▾</span>
                                </div>
                                <div className="department">of Wind Energy Projects.</div>
                                <div id="role-content-2017" className="achievement-content">
                                    <div className="ml-4">
                                        <div className="panel-section">
                                            <h4>What did I do?:</h4>
                                            <p>Maximize the profitability and success of wind farm projects by overseeing commercial and contractual aspects, from bidding strategies and cost analysis to contract negotiation. Ensure alignment with organizational goals and compliance, supporting the Australian Sales Team to secure and deliver profitable, operationally sound projects.</p>
                                        </div>
                                        <div className="panel-section">
                                            <h4>How did I do it?:</h4>
                                            <p>I developed a comparative tool that standardized commercial metrics across potential projects. This innovation enabled the team and the Board of Directors to objectively assess and decide whether to proceed with the EPC contract for a given wind farm, ultimately strengthening the decision-making process.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2017" className="achievement-item"
                                    data-panel="achievement1-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Secured Profitable Contracts
                                        <span id="achievement-arrow-2017-1" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-1")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-1" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Led the negotiation of multiple wind farm project contracts, ensuring favorable terms and maximizing profitability.</p>
                                    </div>
                                </div>
                                <div id="achievement2-2017" className="achievement-item"
                                    data-panel="achievement2-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Optimized Bidding Strategies
                                        <span id="achievement-arrow-2017-2" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-2")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-2" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Developed and refined bidding strategies that integrated accurate cost inputs, financial modeling, and risk assessments, resulting in successful tender outcomes.</p>
                                    </div>
                                </div>
                                <div id="achievement3-2017" className="achievement-item"
                                    data-panel="achievement3-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Enhanced Data-Driven Decision-Making
                                        <span id="achievement-arrow-2017-3" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-3")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-3" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Implemented detailed pricing analyses and financial evaluations, enabling the leadership team to make informed decisions regarding project viability.</p>
                                    </div>
                                </div>
                                <div id="achievement4-2017" className="achievement-item"
                                    data-panel="achievement4-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Streamlined Approval Processes
                                        <span id="achievement-arrow-2017-4" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-4")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-4" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Coordinated cross-functional reviews and internal approvals, reducing turnaround time and aligning stakeholders prior to Board engagement.</p>
                                    </div>
                                </div>
                                <div id="achievement5-2017" className="achievement-item"
                                    data-panel="achievement5-panel-2017"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Improved Risk Management
                                        <span id="achievement-arrow-2017-5" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2017-5")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2017-5" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Oversaw insurance and bonding arrangements, mitigating financial and operational risks while maintaining compliance with industry standards.</p>
                                    </div>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills fixed bottom-0 rounded-b-[20px]">
                                <div className="skills-title">Skills <span id="skills-arrow" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card" data-year="2020" data-location="Australia">
                        <div className="compact-content" onClick={() => { setterCountry("Australia"); selectCard(6); }}>
                            <div className="year">2019</div>
                            <div className="status">- 2021</div>
                            <div className="logo-container">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Senvion Logo" className="image" />
                            </div>
                            <div className="card-location">Melbourne, Australia</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://seeklogo.com/images/S/senvion-logo-BE1D4C3A2E-seeklogo.com.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2019</div>
                                    <div className="status">- 2021</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2020" className="role" >
                                    Sr. Development Manager <span id="role-arrow-2020" className="role-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleRole(2020)}>▾</span>
                                </div>
                                <div className="department">of the Wind Energy Division.</div>
                                <div id="role-content-2020" className="achievement-content">
                                    <div className="ml-4">
                                        <div className="panel-section">
                                            <h4>What did I do?:</h4>
                                            <p>I oversaw the successful delivery of Hills of Gold Wind Farm, ensuring effective management of timelines, budgets, community engagement, technical development, and compliance with environmental and regulatory requirements, while supporting the growth of the team and facilitating capital raising efforts.</p>
                                        </div>
                                        <div className="panel-section">
                                            <h4>How did I do it?:</h4>
                                            <p>I’m particularly proud of my contribution to designing the project layout in a way that minimized biodiversity impacts while maximizing energy output. This involved working closely with civil engineers, surveyors, and wind specialists, carefully integrating geological and topographical data to achieve the optimal layout for the wind farm.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="section">
                                <div className="section-title-container">
                                    <div className="section-title" >
                                        Empathetic Leadership <span id="leadership-arrow-2020" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleLeadership(2020)}>▾</span>
                                    </div>
                                </div>
                                <div id="leadership-content-2020" className="leadership-content">
                                    <p>Managed commercial relationships while mentoring junior staff in contract negotiation and stakeholder management.</p>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2020" className="achievement-item"
                                    data-panel="achievement1-panel-2020"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Led All Technical Studies
                                        <span id="achievement-arrow-2020-1" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2020-1")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2020-1" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Oversaw and coordinated all technical studies for the wind farm, including site assessments, engineering evaluations, and feasibility analyses, ensuring accurate data and adherence to best practices.</p>
                                    </div>
                                </div>
                                <div id="achievement2-2020" className="achievement-item"
                                    data-panel="achievement2-panel-2020"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Strengthened Community Engagement
                                        <span id="achievement-arrow-2020-2" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2020-2")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2020-2" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Developed and implemented comprehensive communication strategies with community manager, fostering positive relationships and support for project initiatives.</p>
                                    </div>
                                </div>
                                <div id="achievement3-2020" className="achievement-item"
                                    data-panel="achievement3-panel-2020"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Streamlined Technical and Regulatory Processes
                                        <span id="achievement-arrow-2020-3" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2020-3")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2020-3" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Provided technical oversight and coordinated environmental impact assessments to comply with State Environmental Assessment Requirements (SEARs), expediting approvals and ensuring on-time project milestones.</p>
                                    </div>
                                </div>
                                <div id="achievement4-2020" className="achievement-item"
                                    data-panel="achievement4-panel-2020"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Optimized Procurement and Capital-Raising Efforts
                                        <span id="achievement-arrow-2020-4" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2020-4")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2020-4" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Managed the wind turbine procurement process, negotiated contracts to reduce overall costs, and supported capital-raising activities by providing critical project information for due diligence.</p>
                                    </div>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills fixed bottom-0 rounded-b-[20px]">
                                <div className="skills-title">Skills <span id="skills-arrow" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card active" data-year="2021" data-location="Colombia">
                        <div className="compact-content" onClick={() => { setterCountry("Colombia"); selectCard(7); }}>
                            <div className="year">2021</div>
                            <div className="status">- current</div>
                            <div className="logo-container">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Logo-pwc.png" alt="PwC Logo" className="image" />
                            </div>
                            <div className="card-location">Bogotá, Colombia</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Logo-pwc.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2021</div>
                                    <div className="status">- current</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2021" className="role" >
                                    Director <span id="role-arrow-2021" className="role-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleRole(2021)}>▾</span>
                                </div>
                                <div className="department">of Sustainability & Climate Change unit.</div>
                                <div id="role-content-2021" className="achievement-content">
                                    <div className="ml-4">
                                        <div className="panel-section">
                                            <h4>What did I do?:</h4>
                                            <p>I lead a dynamic team of professionals dedicated to helping organizations navigate the complexities of <span className="blue-text">sustainability and climate change</span>.</p>
                                        </div>
                                        <div className="panel-section">
                                            <h4>How did I do it?:</h4>
                                            <p>With a blend of <span className="blue-text">strategic vision and hands-on expertise</span>, I collaborate with clients to develop tailored solutions that drive positive environmental impact while delivering business value.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="section">
                                <div className="section-title-container">
                                    <div className="section-title" >
                                        Empathetic Leadership <span id="leadership-arrow-2021" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleLeadership(2021)}>▾</span>
                                    </div>
                                </div>
                                <div id="leadership-content-2021" className="leadership-content">
                                    <p>At PwC, my most significant contribution was building and mentoring a team of <span className="highlight-text">15 young professionals</span>—ranging from assistants to consultants—and guiding their development toward managerial roles. I led the <span className="highlight-text">administrative, commercial, and technical structuring</span> of each service line within our practice.</p>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2021" className="achievement-item"
                                    data-panel="achievement1-panel-2021"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Country lead of the Climate Finance Accelerator in Colombia
                                        <span id="achievement-arrow-2021-1" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2021-1")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2021-1" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Successfully led the implementation of the Climate Finance Accelerator In collaboration with the PwC UK team, the Climate Finance Accelerator program aims to unlock financing for <span className="blue-text">low-carbon projects in middle-income countries</span> across Africa, Asia, and Latin America. It is a technical assistance program funded by International Climate Finance (ICF) through the UK government{"'"}s Department for Energy Security and Net Zero (DESNZ). In Colombia, we were able to support <span className="blue-text">25 projects with a value of investment of US $ 76 MM</span>.</p>
                                    </div>
                                </div>
                                <div id="achievement2-2021" className="achievement-item"
                                    data-panel="achievement2-panel-2021"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">World Economic Forum Fellow Carbon Markets Innovation Initiative
                                        <span id="achievement-arrow-2021-2" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2021-2")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2021-2" className="achievement-content">
                                    <div className="panel-section">
                                        <p>As a Project Fellow at the World Economic Forum's Centre for Climate and Nature, I made significant contributions to the Carbon Market Innovation Initiative and the Centre’s broader activities. From the very outset of this initiative, I played a key role in advising stakeholders across industry and government, successfully leading the strategy, purpose, and business model for implementing Article 6 of the Paris Agreement.</p>
                                    </div>
                                </div>
                                <div id="achievement3-2021" className="achievement-item"
                                    data-panel="achievement3-panel-2021"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Building a team and creating new services
                                        <span id="achievement3-arrow-2021" className="section-title-arrow right" style={{ color: "#003DAE" }} onClick={() => toggleAchievements("2021-3")}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement-content-2021-3" className="achievement-content">
                                    <div className="panel-section">
                                        <p>Built and led a team of 15 consultants to develop seven lines of service: (1) Tax Incentives, (2) Carbon Markets, (3) Decarbonization Strategies, (4) Climate Risk Strategy, (5) Climate Finance, (6) Environmental Due Diligence, and (7) Sustainability and GHG Reporting Assurance.</p>
                                    </div>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills fixed bottom-0 rounded-b-[20px]">
                                <div className="skills-title">Skills <span id="skills-arrow" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}