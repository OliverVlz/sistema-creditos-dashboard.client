import logoColor from '../../../assets_landing/images/ui/logo-color.png';

interface LogoComponentProps {
    className?: string
}

export const LogoComponent = ({ className }: LogoComponentProps) => {
    return (
        <div className={className}>
            <img src={logoColor} alt="Logo" />
        </div>
    )
}