import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaBars } from 'react-icons/fa';
import logo from "../../assets/govimithura_logo.svg";
import { IoBookmarks } from 'react-icons/io5';
import { RiWalkFill } from 'react-icons/ri';
import StartMeasurePage from '../MeasureOption/measureOption.js';
import SavedTemplatesWeb from '../SavedTemplates/SavedTemplatesWeb.js';
import TemplateDetails from '../SavedTemplates/TemplateDetails.js';
import EditTemplateWeb from '../SavedTemplates/EditTemplateWeb.js';

export default function SideNavbar({ onShowMobileOnlyModal }) {
  const [collapsed, setCollapsed] = useState(true);
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [animatePage, setAnimatePage] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
    setCurrentPage(null);
  };

  const handleStartMeasureClick = () => {
    setCurrentPage('StartMeasure');
    setAnimatePage(true);
    if (collapsed) setCollapsed(false);
  };

  const handleSavedTemplatesClick = () => {
    setCurrentPage('SavedTemplates');
    setAnimatePage(true);
    if (collapsed) setCollapsed(false);
  };

  const handleBackClick = () => {
    setAnimatePage(false);
    setTimeout(() => setCurrentPage(null), 300);
  };

  const handleCardClick = (template) => {
    setSelectedTemplate(template);
    setCurrentPage('TemplateDetails');
  };

  const handleBackFromTemplateDetails = () => {
    setCurrentPage('SavedTemplates');
  };

  const handleEditTemplateClick = (template) => {
    setSelectedTemplate(template);
    setCurrentPage('EditTemplateWeb');
  };

  return (
    <Sidebar collapsed={collapsed} style={{ height: '100vh', width: collapsed ? '50px' : '300px' }}>
      <div style={styles.head}>
        <div style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={handleToggleSidebar}>
          <FaBars color='#65676b' />
        </div>
        <div style={styles.logoContainer}>
          {!collapsed && <img src={logo} alt='Logo' style={styles.logo} />}
        </div>
      </div>
      <div style={styles.content}>
        {!currentPage && (
          <Menu>
            <MenuItem
              onClick={handleStartMeasureClick}
              onMouseEnter={() => setHoveredMenuItem('startmeasure')}
              onMouseLeave={() => setHoveredMenuItem(null)}
              style={{
                ...styles.menuItem,
                ...(hoveredMenuItem === 'startmeasure' ? styles.hoveredMenuItem : {}),
              }}
            >
              <RiWalkFill fontSize={25} style={{ marginRight: '10px' }} />
              {!collapsed && 'Start measure'}
            </MenuItem>
            <MenuItem
              onClick={handleSavedTemplatesClick}
              onMouseEnter={() => setHoveredMenuItem('Templates')}
              onMouseLeave={() => setHoveredMenuItem(null)}
              style={{
                ...styles.menuItem,
                ...(hoveredMenuItem === 'Templates' ? styles.hoveredMenuItem : {}),
              }}
            >
              <IoBookmarks fontSize={18} style={{ marginRight: '15px' }} />
              {!collapsed && 'Templates'}
            </MenuItem>
          </Menu>
        )}
        <div
          style={{
            ...styles.startMeasureContainer,
            transform: animatePage ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease-in-out',
            backgroundColor: 'whitesmoke',
            height: currentPage ? 'calc(100vh - 60px)' : '0',
            overflow: 'auto',
          }}
        >
          {currentPage === 'StartMeasure' && (
            <StartMeasurePage onBackToSidebar={handleBackClick} onMobileOnlyFeature={onShowMobileOnlyModal} />
          )}
          {currentPage === 'SavedTemplates' && (
            <SavedTemplatesWeb
              onBackToSidebar={handleBackClick}
              onCardClick={handleCardClick}
              handleEditTemplateClick={handleEditTemplateClick}
            />
          )}
          {currentPage === 'TemplateDetails' && (
            <TemplateDetails
              onBackToSidebar={handleBackFromTemplateDetails}
              template={selectedTemplate}
              handleEditTemplateClick={handleEditTemplateClick}
            />
          )}
          {currentPage === 'EditTemplateWeb' && (
            <EditTemplateWeb
              onBackToSidebar={() => setCurrentPage('TemplateDetails')}
              template={selectedTemplate}
              onSaveSuccess={() => setCurrentPage('SavedTemplates')}
            />
          )}
        </div>
      </div>
    </Sidebar>
  );
}

const styles = {
  startMeasureContainer: {
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: '0px',
    boxSizing: 'border-box',
  },
  head: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    height: '60px',
    borderBottom: '1px solid #CED0D4',
    alignItems: 'center',
    padding: '0 20px',
  },
  logo: {
    height: '40px',
    width: '100px',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  hoveredMenuItem: {
    backgroundColor: '#1640D6',
    color: 'white',
  },
  content: {
    marginTop: '5px',
    height: 'calc(100vh - 65px)',
    display: 'flex',
    flexDirection: 'column',
  },
  menuItem: {
    marginTop: '5px',
    marginRight: '8px',
    marginLeft: '8px',
    borderRadius: '5px',
    borderBottom: '1px solid #CED0D4',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
};
