import './File.css';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

export default function FileView(props) {

    return (
        <div class="file-comp-item" onClick={()=>window.open(`/api/files/download/${props.file.file_id}`)} key={props.file.file_id}>
            <div class="file-item-header">
                <p>{props.file.file_name}</p>
            </div>
            <InsertDriveFileIcon style={{ fontSize: '50px' }} />
        </div>
    );
}
