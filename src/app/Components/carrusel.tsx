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
    let initialLoad = true; // Flag to track initial load
    const CLONES_PER_SIDE = 4; // Number of clones to add on each side for infinite scrolling

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
            initialLoad = false;
        }, 100);
    }

    function selectCard(newIndex: number, isInitial = false) {
        if (isAnimating && !isInitial) return;

        isAnimating = true;

        // Closing any open panels first
        resetExpandedElements();

        // Storing previous active index for reference
        const previousIndex = index;

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

    function applyBlurredEffect(cards: any[] | NodeListOf<HTMLElement>) {
        // We want cards that are far from the active card to be blurred
        const totalCards = cards.length;

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
        const selectedCardRect = selectedCard.getBoundingClientRect();

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
    }, [window]);

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
                    // Removing the inline onclick to avoid double-firing
                    const onclickAttr = titleElement.getAttribute('onclick');
                    titleElement.removeAttribute('onclick');

                    // Add event listener directly
                    titleElement.addEventListener('click', function () {
                        toggleLeadership(year);
                    });
                }
            }
        });
    }

    function toggleAchievement(panelId: string, arrowId: string, itemId: string) {
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
    }

    function positionPanelWithAchievement(panel: HTMLElement, achievementItem: HTMLElement) {
        setTimeout(() => {
            const itemRect = achievementItem.getBoundingClientRect();
            const cardRect = achievementItem?.closest('.timeline-card')?.getBoundingClientRect();
            const centerY = itemRect.top + (itemRect.height / 2) - (cardRect?.top ?? 0);
            panel.style.top = `${centerY - (panel.offsetHeight / 2)}px`;

            const panelTop = parseInt(panel.style.top);
            if (panelTop < 0) {
                panel.style.top = '20px';
            }

            checkAndAdjustPanelOverlaps();
        }, 150);
    }

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

    // window resize
    window.addEventListener('resize', () => {
        // Reposition timeline without animation
        moveTimelineToPosition(true);
        adjustArrowsPosition();
        validateAllPanelPositions();
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

    return (
        <>
            <div className="scroll-arrow left-arrow" onClick={scrollLeft}>←</div>
            <div className="scroll-arrow right-arrow" onClick={scrollRight}>→</div>
            <div className="timeline-container pb-4">
                <div className="blur-overlay blur-left"></div>
                <div className="blur-overlay blur-right"></div>

                <div className="timeline-wrapper" id="timeline">
                    <div className="timeline-card" data-year="2003" data-location="Colombia">
                        <div className="compact-content" onClick={() => { setterCountry("Colombia"); selectCard(0); }}>
                            <div className="year">2003</div>
                            <div className="status">- 2006</div>
                            <div className="logo-container">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Logos%C3%ADmbolo_UPB.svg/512px-Logos%C3%ADmbolo_UPB.svg.png" alt="UPB Logo" className="image" />
                            </div>
                            <div className="card-location">Medellín, Colombia</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Logos%C3%ADmbolo_UPB.svg/512px-Logos%C3%ADmbolo_UPB.svg.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2003</div>
                                    <div className="status">- 2006</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2003" className="role" >
                                    Junior Engineer <span id="role-arrow-2003" className="role-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                </div>
                                <div className="department">Department of Civil Engineering</div>
                            </div>

                            <div className="section">
                                <div className="section-title-container">
                                    <div className="section-title" >
                                        Empathetic Leadership <span id="leadership-arrow-2003" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </div>
                                </div>
                                <div id="leadership-content-2003" className="leadership-content">
                                    <p>Participated in collaborative research projects with senior staff, developing foundational team skills.</p>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2003" className="achievement-item"
                                    data-panel="achievement1-panel-2003"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Research focused on civil engineering infrastructure assessment
                                        <span id="achievement1-arrow-2003" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement2-2003" className="achievement-item"
                                    data-panel="achievement2-panel-2003"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Early career development in structural analysis
                                        <span id="achievement2-arrow-2003" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills">
                                <div className="skills-title">Skills <span className="info-icon">i</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card" data-year="2007" data-location="USA">
                        <div className="compact-content" onClick={() => { setterCountry("USA"); selectCard(1); }}>
                            <div className="year">2007</div>
                            <div className="status">- 2009</div>
                            <div className="logo-container">
                                <img src="https://download.logo.wine/logo/Kansas_State_University/Kansas_State_University-Logo.wine.png" alt="KSU Logo" className="image" />
                            </div>
                            <div className="card-location">Manhattan, Kansas, USA</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://download.logo.wine/logo/Kansas_State_University/Kansas_State_University-Logo.wine.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2007</div>
                                    <div className="status">- 2009</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2007" className="role" >
                                    Research Assistant <span id="role-arrow-2007" className="role-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                </div>
                                <div className="department">Department of Agronomy</div>
                            </div>

                            <div className="section">
                                <div className="section-title-container">
                                    <div className="section-title" >
                                        Empathetic Leadership <span id="leadership-arrow-2007" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </div>
                                </div>
                                <div id="leadership-content-2007" className="leadership-content">
                                    <p>Coordinated field experiments with a small team of junior researchers, developing early leadership capabilities.</p>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2007" className="achievement-item"
                                    data-panel="achievement1-panel-2007"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Agricultural research on sustainable farming practices
                                        <span id="achievement1-arrow-2007" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement2-2007" className="achievement-item"
                                    data-panel="achievement2-panel-2007"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Academic contribution to soil conservation techniques
                                        <span id="achievement2-arrow-2007" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills">
                                <div className="skills-title">Skills <span className="info-icon">i</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card" data-year="2010" data-location="USA">
                        <div className="compact-content" onClick={() => { setterCountry("USA"); selectCard(2); }}>
                            <div className="year">2010</div>
                            <div className="status">- 2012</div>
                            <div className="logo-container">
                                <img src="https://1000marcas.net/wp-content/uploads/2022/07/Johns-Hopkins-University-Logo-tumb-1280x720.png" alt="JHU Logo" className="image" />
                            </div>
                            <div className="card-location">Baltimore, USA</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://1000marcas.net/wp-content/uploads/2022/07/Johns-Hopkins-University-Logo-tumb-1280x720.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2010</div>
                                    <div className="status">- 2012</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2010" className="role" >
                                    Research Assistant <span id="role-arrow-2010" className="role-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                </div>
                                <div className="department">Department of Material Science</div>
                            </div>

                            <div className="section">
                                <div className="section-title-container">
                                    <div className="section-title" >
                                        Empathetic Leadership <span id="leadership-arrow-2010" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </div>
                                </div>
                                <div id="leadership-content-2010" className="leadership-content">
                                    <p>Led a focused research initiative, managing project timelines and deliverables while mentoring undergraduate students.</p>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2010" className="achievement-item"
                                    data-panel="achievement1-panel-2010"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Materials research on composite structures
                                        <span id="achievement1-arrow-2010" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement2-2010" className="achievement-item"
                                    data-panel="achievement2-panel-2010"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Engineering advances in sustainable materials
                                        <span id="achievement2-arrow-2010" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills">
                                <div className="skills-title">Skills <span className="info-icon">i</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card" data-year="2013" data-location="Colombia">
                        <div className="compact-content" onClick={() => { setterCountry("Colombia"); selectCard(3); }}>
                            <div className="year">2013</div>
                            <div className="status">- 2014</div>
                            <div className="logo-container">
                                <img src="https://www.ccyk.com.co/wp-content/uploads/2018/07/logo-universidad-medellin-1.png" alt="UDEM Logo" className="image" />
                            </div>
                            <div className="card-location">Medellín, Colombia</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://www.ccyk.com.co/wp-content/uploads/2018/07/logo-universidad-medellin-1.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2013</div>
                                    <div className="status">- 2014</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2013" className="role" >
                                    Assistant Professor <span id="role-arrow-2013" className="role-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                </div>
                                <div className="department">Department of Environmental Engineering</div>
                            </div>

                            <div className="section">
                                <div className="section-title-container">
                                    <div className="section-title" >
                                        Empathetic Leadership <span id="leadership-arrow-2013" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </div>
                                </div>
                                <div id="leadership-content-2013" className="leadership-content">
                                    <p>Developed and led new courses in environmental engineering, mentoring students and guiding thesis projects.</p>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2013" className="achievement-item"
                                    data-panel="achievement1-panel-2013"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Academic leadership in curriculum development
                                        <span id="achievement1-arrow-2013" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement2-2013" className="achievement-item"
                                    data-panel="achievement2-panel-2013"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Environmental engineering research on water systems
                                        <span id="achievement2-arrow-2013" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills">
                                <div className="skills-title">Skills <span className="info-icon">i</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card" data-year="2014" data-location="Colombia">
                        <div className="compact-content" onClick={() => { setterCountry("Colombia"); selectCard(4); }}>
                            <div className="year">2014</div>
                            <div className="status">- 2018</div>
                            <div className="logo-container">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/PricewaterhouseCoopers_Logo.svg/1280px-PricewaterhouseCoopers_Logo.svg.png" alt="PwC Logo" className="image" />
                            </div>
                            <div className="card-location">Bogotá, Colombia</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/PricewaterhouseCoopers_Logo.svg/1280px-PricewaterhouseCoopers_Logo.svg.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2014</div>
                                    <div className="status">- 2018</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2014" className="role" >
                                    Manager <span id="role-arrow-2014" className="role-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                </div>
                                <div className="department">Sustainable Energy and Climate Change Unit</div>
                            </div>

                            <div className="section">
                                <div className="section-title-container">
                                    <div className="section-title" >
                                        Empathetic Leadership <span id="leadership-arrow-2014" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </div>
                                </div>
                                <div id="leadership-content-2014" className="leadership-content">
                                    <p>Built a team of consultants focused on sustainability solutions, creating a collaborative environment for professional growth.</p>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2014" className="achievement-item"
                                    data-panel="achievement1-panel-2014"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Sustainability management for major corporate clients
                                        <span id="achievement1-arrow-2014" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement2-2014" className="achievement-item"
                                    data-panel="achievement2-panel-2014"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Climate change initiatives for the energy sector
                                        <span id="achievement2-arrow-2014" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills">
                                <div className="skills-title">Skills <span className="info-icon">i</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card" data-year="2018" data-location="Colombia">
                        <div className="compact-content" onClick={() => { setterCountry("Colombia"); selectCard(5); }}>
                            <div className="year">2018</div>
                            <div className="status">- 2020</div>
                            <div className="logo-container">
                                <img src="https://www.integral.com.co/images/LOGO-INTEGRAL-COLOR.png" alt="Integral Logo" className="image" />
                            </div>
                            <div className="card-location">Medellín, Colombia</div>
                        </div>
                        <div className="detailed-content">
                            <div className="card-header">
                                <img src="https://www.integral.com.co/images/LOGO-INTEGRAL-COLOR.png" alt="Company Logo" className="logo" />
                                <div className="year-container">
                                    <div className="year">2018</div>
                                    <div className="status">- 2020</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2018" className="role" >
                                    Team Leader <span id="role-arrow-2018" className="role-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                </div>
                                <div className="department">Environmental Impact Assessment</div>
                            </div>

                            <div className="section">
                                <div className="section-title-container">
                                    <div className="section-title" >
                                        Empathetic Leadership <span id="leadership-arrow-2018" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </div>
                                </div>
                                <div id="leadership-content-2018" className="leadership-content">
                                    <p>Led a diverse team of environmental specialists working on international projects, developing cross-cultural leadership skills.</p>
                                </div>
                            </div>

                            <div className="section achievements-section">
                                <div className="section-title-container">
                                    <div className="section-title">
                                        Achievements
                                    </div>
                                </div>
                                <div id="achievement1-2018" className="achievement-item"
                                    data-panel="achievement1-panel-2018"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Environmental assessment for international projects
                                        <span id="achievement1-arrow-2018" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement2-2018" className="achievement-item"
                                    data-panel="achievement2-panel-2018"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Team leadership across multiple countries
                                        <span id="achievement2-arrow-2018" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills">
                                <div className="skills-title">Skills <span className="info-icon">i</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-card" data-year="2020" data-location="Australia">
                        <div className="compact-content" onClick={() => { setterCountry("Australia"); selectCard(6); }}>
                            <div className="year">2020</div>
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
                                    <div className="year">2020</div>
                                    <div className="status">- 2021</div>
                                </div>
                            </div>

                            <div className="role-container">
                                <div id="director-role-2020" className="role" >
                                    Commercial Manager <span id="role-arrow-2020" className="role-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                </div>
                                <div className="department">Wind Energy Division</div>
                            </div>

                            <div className="section">
                                <div className="section-title-container">
                                    <div className="section-title" >
                                        Empathetic Leadership <span id="leadership-arrow-2020" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
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
                                    <span className="achievement-text">Wind energy development across the Australian market
                                        <span id="achievement1-arrow-2020" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div id="achievement2-2020" className="achievement-item"
                                    data-panel="achievement2-panel-2020"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Commercial contract management for renewable projects
                                        <span id="achievement2-arrow-2020" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills">
                                <div className="skills-title">Skills <span className="info-icon">i</span></div>
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
                                        <p>Successfully led the implementation of the Climate Finance Accelerator In collaboration with the PwC UK team, the Climate Finance Accelerator program aims to unlock financing for <span className="blue-text">low-carbon projects in middle-income countries</span> across Africa, Asia, and Latin America. It is a technical assistance program funded by International Climate Finance (ICF) through the UK government's Department for Energy Security and Net Zero (DESNZ). In Colombia, we were able to support <span className="blue-text">25 projects with a value of investment of US $ 76 MM</span>.</p>
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
                                        <p>Successfully led the implementation of the Climate Finance Accelerator In collaboration with the PwC UK team, the Climate Finance Accelerator program aims to unlock financing for <span className="blue-text">low-carbon projects in middle-income countries</span> across Africa, Asia, and Latin America. It is a technical assistance program funded by International Climate Finance (ICF) through the UK government's Department for Energy Security and Net Zero (DESNZ). In Colombia, we were able to support <span className="blue-text">25 projects with a value of investment of US $ 76 MM</span>.</p>
                                    </div>
                                </div>
                                <div id="achievement3-2021" className="achievement-item"
                                    data-panel="achievement3-panel-2021"
                                >
                                    <span className="achievement-bullet">•</span>
                                    <span className="achievement-text">Building a team and creating new services
                                        <span id="achievement3-arrow-2021" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span>
                                    </span>
                                </div>
                                <div className="achievements-bottom-line"></div>
                            </div>

                            <div className="skills">
                                <div className="skills-title">Skills <span id="skills-arrow" className="section-title-arrow right" style={{ color: "#003DAE" }}>▾</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}