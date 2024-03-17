export interface AlertProps {
    handleShowAlert: (message: string, type: 'success' | 'error' | 'info') => void;
}