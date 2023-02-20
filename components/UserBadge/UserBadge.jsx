import { Avatar } from '@mui/material';
import './UserBadge.css';


export default function UserBadge(props) {

    return (
        <div class="user-badge-container">
            <Avatar>{props.name.substring(0,1).toUpperCase()}</Avatar>
            <div class="user-badge-details">
                <p class="user-badge-name">{props.name}</p>
                <p class="user-badge-job">{props.profession}</p>
                <p class="user-badge-education">{props.education}</p>
            </div>
        </div>
    );
}
