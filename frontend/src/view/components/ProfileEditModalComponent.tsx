import React from 'react';

interface ProfileEditModalComponentProps {
    onClose: () => void;
}

const ProfileEditModalComponent: React.FC<ProfileEditModalComponentProps> = ({ onClose }) => {
    // TODO: CHANGE TO BOOTSTRAP
    return (
       <div>
        <div className="custom-modal">
            <h3>Profil Bearbeiten</h3>
            <p>Beschreibung</p>
            <p>Bild</p>
            <p>Nummer</p>
            <p>...</p>
            <p>Speichern</p>
            <p>Löschen</p>
            <button onClick={onClose}>Schließen</button>
        </div>
    <span className="custom-modal-overlay"> </span>
       </div>
    );
};

export default ProfileEditModalComponent;
