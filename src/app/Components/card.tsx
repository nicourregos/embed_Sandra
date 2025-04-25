export default function Card() {

    function positionPanelWithAchievement(panel: HTMLElement | null, achievementItem: HTMLElement | null) {
        setTimeout(() => {
            const itemRect = achievementItem?.getBoundingClientRect();
            const cardRect = document.querySelector('.timeline-card')?.getBoundingClientRect();
            const centerY = itemRect.top + (itemRect.height / 2) - cardRect.top;
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
            .filter(panel => panel.id.includes('achievement'));

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
            const panel = document.getElementById(panelId);

            if (panel && panel.classList.contains('active')) {
                const itemRect = item.getBoundingClientRect();
                const cardRect = document.querySelector('.timeline-card')?.getBoundingClientRect();
                const centerY = itemRect.top + (itemRect.height / 2) - cardRect.top;
                panel.style.top = `${centerY - (panel.offsetHeight / 2)}px`;
            }
        });

        checkAndAdjustPanelOverlaps();
        setTimeout(checkAndAdjustPanelOverlaps, 50);
    }

    function toggleRole() {
        const roleBox = document.getElementById('director-role');
        const arrow = document.getElementById('role-arrow');

        roleBox.classList.toggle('expanded');
        arrow.classList.toggle('right');

        const panel = document.getElementById('role-details-panel');
        panel.classList.toggle('active');
    }

    function toggleLeadership() {
        const content = document.getElementById('leadership-content');
        const arrow = document.getElementById('leadership-arrow');

        content?.classList.toggle('expanded');
        arrow?.classList.toggle('right');

        document.getElementById('leadership-panel')?.classList.remove('active');
        setTimeout(validateAllPanelPositions, 300);
    }

    function toggleAchievement(panelId: string, arrowId: string, itemId: string) {
        const arrow = document.getElementById(arrowId);
        const achievementItem = document.getElementById(itemId);
        const panel = document.getElementById(panelId);

        achievementItem.classList.toggle('active');
        arrow.classList.toggle('right');

        if (achievementItem.classList.contains('active')) {
            achievementItem.style.marginTop = '80px';
            achievementItem.style.marginBottom = '80px';
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
    }

    return (
        <div className="timeline-card">
            <div className="card-header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Logo-pwc.png" alt="PwC Logo" className="logo" />
                <div className="year-container">
                    <div className="year">2021</div>
                    <div className="status">- current</div>
                </div>
            </div>

            <div className="role-container">
                <div id="director-role" className="role" onClick={toggleRole}>
                    Director <span id="role-arrow" className="role-arrow right">▾</span>
                </div>
                <div className="department">of Sustainability & Climate Change unit.</div>
            </div>

            <div className="section">
                <div className="section-title-container">
                    <div className="section-title" onClick={toggleLeadership}>
                        Empathetic Leadership <span id="leadership-arrow" className="section-title-arrow right">▾</span>
                    </div>
                </div>
                <div id="leadership-content" className="leadership-content">
                    <p>At PwC, my most significant contribution was <span className="highlight-text">building and mentoring a team of 15 young professionals</span>—ranging from assistants to consultants—and <span className="highlight-text">guiding their development toward managerial roles</span>.</p>
                    <p>I led the administrative, commercial, and technical structuring of each service line within our practice.</p>
                </div>
            </div>

            <div className="section achievements-section">
                <div className="section-title-container">
                    <div className="section-title">
                        Achievements
                    </div>
                </div>
                <div id="achievement1" className="achievement-item" data-panel="achievement1-panel" onClick={() => toggleAchievement('achievement1-panel', 'achievement1-arrow', 'achievement1')}>
                    <span className="achievement-bullet">•</span>
                    <span className="achievement-text">Country lead of the Climate Finance Accelerator in Colombia
                        <span id="achievement1-arrow" className="section-title-arrow right">▾</span>
                    </span>
                </div>

                <div id="achievement2" className="achievement-item" data-panel="achievement2-panel" onClick={() => toggleAchievement('achievement2-panel', 'achievement2-arrow', 'achievement2')}>
                    <span className="achievement-bullet">•</span>
                    <span className="achievement-text">World Economic Forum Fellow Carbon Markets Innovation Initiative
                        <span id="achievement2-arrow" className="section-title-arrow right">▾</span>
                    </span>
                </div>

                <div id="achievement3" className="achievement-item" data-panel="achievement3-panel" onClick={() => toggleAchievement('achievement3-panel', 'achievement3-arrow', 'achievement3')}>
                    <span className="achievement-bullet">•</span>
                    <span className="achievement-text">Building a team and creating new services
                        <span id="achievement3-arrow" className="section-title-arrow right">▾</span>
                    </span>
                </div>
                <div className="achievements-bottom-line"></div>
            </div>

            <div className="skills">
                <div className="skills-title">Skills</div>
                <div className="info-icon">i</div>
            </div>
        </div>

    );
}

{/* 
93 % de almacenamiento usado … Si te quedas sin espacio, no podrás crear, editar ni subir archivos. Disfruta de 100 GB de almacenamiento por $ 8.900,00 $ 2.000,00 al mes durante 2 meses.
demo.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Timeline Card</title>
    <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Chivo+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap" rel="stylesheet">
    <link href="https://fonts.cdnfonts.com/css/pp-neue-montreal" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Raleway', sans-serif;
            background-color: #dddddd;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 2rem;
        }
        
        .card-container {
            display: flex;
            position: relative;
        }
        
        .timeline-card {
            width: 364px;
            min-height: 553px;
            height: auto;
            background-color: #f0f0f06e;
            border-radius: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            padding: 20px;
            position: relative;
            z-index: 1;
        }
        
        .card-header {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        
        .logo {
            width: 120px;
            height: auto;
            margin-right: 15px;
            margin-left: 5px;
            margin-top: 12px;
        }
        
        .year-container {
            display: flex;
            flex-direction: column;
        }
        
        .year {
            font-size: 85px;
            color: #666;
            font-weight: 500;
            line-height: 0.9;
            font-family: 'PP Neue Montreal', sans-serif;
        }
        
        .status {
            font-size: 48px;
            margin-top: -10px;
            font-weight: 500;
            color: #666;
            font-family: 'PP Neue Montreal', sans-serif;
        }
        
        .role-container {
            margin-bottom: 20px;
            position: relative;
            width: 100%;
        }

        #leadership-arrow {
            color: #003DAE;
        }

        #roles-detail-panel {
            width: 320px;
        }

        .role {
            font-size: 27px;
            font-weight: 500;
            font-family: 'Chivo Mono', monospace;
            width: 104%;
            padding: 3px 10px;
            border: 2px solid transparent;
            border-radius: 10px 0px 0px 10px;
            color: #000000;
            background-color: #00E494;
            margin-bottom: 5px;
            margin-left: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .role.expanded {
            background-color: transparent;
            border: 2px solid #1de9b6;
        }
        
        .role-arrow {
            margin-left: 45%;
            display: inline-block;
            transition: transform 0.3s ease;
        }
        
        .role-arrow.right {
            transform: rotate(-90deg);
        }
        
        .department {
            font-size: 16px;
            font-family: 'Chivo Mono', monospace;
            color: #555;
            margin-top: 5px;
            padding-left: 32px;
            padding-right: 15px;
        }
        
        .section {
            margin-bottom: 15px;
            position: relative;
            padding-left: 15px;
            padding-right: 15px;
            background-color: transparent;
        }
        
        .section-title-container {
            position: relative;
            margin-bottom: -8px;
            border-bottom: 1px solid #a1a1a1;
            padding-bottom: 5px;
        }
        
        .section-title {
            width: 100%;
            font-family: 'Chivo Mono', monospace;
            font-size: 20px;
            margin-left: 10px;
            font-weight: 500;
            display: flex;
            align-items: center;
            cursor: pointer;
            color: #070707;
            background-color: transparent;
            display: inline-block;
        }
        
        .section-title-arrow {
            margin-left: 0px;
            display: inline-block;
            transition: transform 0.3s ease;
        }
        
        .section-title-arrow.right {
            transform: rotate(-90deg);
        }
        
        .leadership-content {
            font-size: 15px;
            line-height: 1.2;
            color: #666;
            margin-top: 20px;
            width: 100%;
            padding-left: 10px;
            padding-right: 0px;
            font-family: 'Raleway', sans-serif;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
        
        .leadership-content.expanded {
            max-height: 300px;
            transition: max-height 0.5s ease-in;
        }
        
        .leadership-content p {
            margin-bottom: 10px;
        }
        
        .highlight-text {
            color: #003DAE;
            font-weight: bold;
        }
        
        .achievement-item {
            margin-bottom: 0px;
            display: flex;
            align-items: baseline;
            cursor: pointer;
            transition: margin-top 0.3s ease, margin-bottom 0.3s ease;
        }
        
        .achievement-bullet {
            color: #666;
            font-weight: bold;
            margin-right: 8px;
        }
        
        .achievement-text {
            font-size: 15px;
            color: #666;
            font-weight: 500;
            font-family: 'Raleway', sans-serif;
        }
        
        .achievements-bottom-line {
            border-bottom: 0.7px solid #ddd;
            margin-top: 10px;
        }
        
        .skills {
            margin-top: 0px;
            position: relative;
            bottom: 20px;
            left: 20px;
            display: flex;
            align-items: center;
        }
        
        .skills-title {
            font-size: 20px;
            font-weight: 500;
            font-family: 'Chivo Mono', monospace;
            margin-top: 20px;
            color: #000000;
        }
        
        .info-icon {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            background-color: #ddd;
            color: #666;
            font-size: 13px;
            font-weight: bold;
            margin-left: 5px;
            cursor: pointer;
        }
        
        .expandable-panel {
            position: absolute;
            left: 364px;
            background-color: #f0f0f06e;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            padding: 25px;
            width: 480px;
            height: auto;
            color: #666;
            font-size: 14px;
            z-index: 0;
            opacity: 0;
            visibility: hidden;
            transition: opacity 1s ease, visibility 0.3s, top 0.8s ease;
        }
        
        .expandable-panel.active {
            opacity: 1;
            visibility: visible;
            z-index: 0;
        }
        
        .role-details-panel {
            top: 30px;
            width: 320px;
        }
        
        .leadership-panel {
            top: 200px;
        }
        
        .achievement1-panel {
            top: 300px;
        }
        
        .achievement2-panel {
            top: 300px;
        }
        
        .achievement3-panel {
            top: 300px;
        }
        
        .panel-section {
            margin-bottom: 10px;
        }
        
        .panel-section h4 {
            color: #000000;
            margin-bottom: 6px;
            font-size: 14px;
            font-family: 'Raleway', sans-serif;
            font-style: italic;
            font-weight: bold;
        }
        
        .panel-section p {
            color: #333;
            font-size: 13px;
            line-height: 1.4;
            margin-bottom: 10px;
            font-family: 'Raleway', sans-serif;
        }
        
        .panel-section p .blue-text {
            color: #003DAE;
            font-weight: bold;
            font-family: 'Raleway', sans-serif;
        }
        
        .panel-checkmark {
            color: #003DAE;
            font-weight: bold;
            margin-right: 5px;
        }
        
        .achievements-section .achievement-item {
            margin-top: 10px;
        }

        .achievement-item.active .achievement-text {
            color: #003DAE;
            font-weight: bold;
            margin-top: 80px;
            margin-bottom: 80px;
            padding-right: 20px;
        }
        
        .lo-subrayado {
            text-decoration: underline;
            font-family: 'Raleway', sans-serif;
            font-size: 14px;
            font-weight: bold;
        }
        
        .arrow-container {
            display: inline-flex;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="card-container">
        <!-- Main Card -->

        
        <!-- Expandable Panels -->
        <div id="role-details-panel" class="expandable-panel role-details-panel">
            <div class="panel-section">
                <h4>What did I do?:</h4>
                <p>I <span class="blue-text">lead a dynamic team</span> of professionals dedicated to helping organizations <span class="blue-text">navigate the complexities of sustainability and climate change</span>.</p>
            </div>
            <div class="panel-section">
                <h4>How did I do it?:</h4>
                <p>With a blend of <span class="blue-text">strategic vision and hands-on expertise</span>, I collaborate with clients to develop tailored solutions that <span class="blue-text">drive positive environmental impact while delivering business value</span>.</p>
            </div>
        </div>
        
        <div id="leadership-panel" class="expandable-panel leadership-panel">
            <div class="panel-section">
                <h4>Empathetic Leadership Approach:</h4>
                <p>As a leader, I focus on understanding team members' strengths and growth areas, providing personalized mentorship opportunities while creating a collaborative environment where innovative ideas can flourish.</p>
                <p>My approach centers on balancing technical excellence with personal development, ensuring team members gain exposure to diverse projects while developing specialized expertise.</p>
            </div>
        </div>
        
        <div id="achievement1-panel" class="expandable-panel achievement1-panel">
            <div class="panel-section">
                <p>Successfully led the implementation of the Climate Finance Accelerator In collaboration with the PwC UK team, the Climate Finance Accelerator program aims to unlock financing for low-carbon projects in middle-income countries across Africa, Asia, and Latin America. 
                    It is a technical assistance program funded by International Climate Finance (ICF) through the UK government's Department for Energy Security and Net Zero (DESNZ).
                    In Colombia, we were able to support 25 projects with a value of investment of US $ 76 MM.
                </p>
            </div>
        </div>
        
        <div id="achievement2-panel" class="expandable-panel achievement2-panel">
            <div class="panel-section">
                <p>Selected as a fellow for the World Economic Forum's Carbon Markets Innovation Initiative, contributing expertise in developing innovative carbon market mechanisms.
                Collaborated with global experts to develop recommendations for scaling voluntary carbon markets and improving their integrity and effectiveness.</p>
            </div>
        </div>
        
        <div id="achievement3-panel" class="expandable-panel achievement3-panel">
            <div class="panel-section">
                <p>Developed and launched new service offerings in climate risk assessment, ESG strategy implementation, and sustainable finance advisory
                Built and mentored a multi-disciplinary team of 15 professionals with expertise across sustainability domains, creating a high-performing practice focused on client impact.</p>
            </div>
        </div>
    </div>
    
    <script>
        function positionPanelWithAchievement(panel, achievementItem) {
            setTimeout(() => {
                const itemRect = achievementItem.getBoundingClientRect();
                const cardRect = document.querySelector('.timeline-card').getBoundingClientRect();
                const centerY = itemRect.top + (itemRect.height / 2) - cardRect.top;
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
                .filter(panel => panel.id.includes('achievement'));
            
            if (activePanels.length <= 1) return;
            
            activePanels.sort((a, b) => parseInt(a.style.top) - parseInt(b.style.top));
            
            for (let i = 1; i < activePanels.length; i++) {
                const previousPanel = activePanels[i-1];
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
                const panel = document.getElementById(panelId);
                
                if (panel && panel.classList.contains('active')) {
                    const itemRect = item.getBoundingClientRect();
                    const cardRect = document.querySelector('.timeline-card').getBoundingClientRect();
                    const centerY = itemRect.top + (itemRect.height / 2) - cardRect.top;
                    panel.style.top = `${centerY - (panel.offsetHeight / 2)}px`;
                }
            });
            
            checkAndAdjustPanelOverlaps();
            setTimeout(checkAndAdjustPanelOverlaps, 50);
        }
        
        function toggleRole() {
            const roleBox = document.getElementById('director-role');
            const arrow = document.getElementById('role-arrow');
            
            roleBox.classList.toggle('expanded');
            arrow.classList.toggle('right');
            
            const panel = document.getElementById('role-details-panel');
            panel.classList.toggle('active');
        }
        
        function toggleLeadership() {
            const content = document.getElementById('leadership-content');
            const arrow = document.getElementById('leadership-arrow');
            
            content.classList.toggle('expanded');
            arrow.classList.toggle('right');
            
            document.getElementById('leadership-panel').classList.remove('active');
            setTimeout(validateAllPanelPositions, 300);
        }
        
        function toggleAchievement(panelId, arrowId, itemId) {
            const arrow = document.getElementById(arrowId);
            const achievementItem = document.getElementById(itemId);
            const panel = document.getElementById(panelId);
            
            achievementItem.classList.toggle('active');
            arrow.classList.toggle('right');
            
            if (achievementItem.classList.contains('active')) {
                achievementItem.style.marginTop = '80px';
                achievementItem.style.marginBottom = '80px';
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
        }
        
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.expandable-panel') && 
                !event.target.closest('.role') && 
                !event.target.closest('.section-title') && 
                !event.target.closest('.achievement-item')) {
                
                if (!event.target.closest('.role')) {
                    document.getElementById('director-role').classList.remove('expanded');
                    document.getElementById('role-arrow').classList.add('right');
                    document.getElementById('role-details-panel').classList.remove('active');
                }
                
                if (!event.target.closest('.section-title')) {
                    document.getElementById('leadership-content').classList.remove('expanded');
                    document.getElementById('leadership-arrow').classList.add('right');
                }
                
                document.querySelectorAll('.achievement-item').forEach(item => {
                    item.classList.remove('active');
                    item.style.marginTop = '';
                    item.style.marginBottom = '';
                });
                
                document.querySelectorAll('.achievement-item .section-title-arrow').forEach(arrow => {
                    arrow.classList.add('right');
                });
                
                document.querySelectorAll('.expandable-panel').forEach(panel => {
                    if (panel.id !== 'role-details-panel' && panel.id !== 'leadership-panel') {
                        panel.classList.remove('active');
                    }
                });
            }
        });
        
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('role-arrow').classList.add('right');
            document.getElementById('leadership-arrow').classList.add('right');
            document.querySelectorAll('.achievement-item .section-title-arrow').forEach(arrow => {
                arrow.classList.add('right');
            });
        });
    </script>
</body>
</html> */}