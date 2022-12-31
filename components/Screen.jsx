export default function Screen(props) {
    return (
        <div style={{
            position: 'fixed',
            top: '6%',
            height: '94%',
            width: '100%',
            overflowY: 'auto'
        }}>
            {props.children}
        </div>
    );
}
