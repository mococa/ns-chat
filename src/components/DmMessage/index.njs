// Helpers
import { createAvatar } from '../../helpers/createAvatar';
import { formatDate } from '../../helpers/formatDate';

// Styles
import './styles.scss';

export const DmMessage = ({
  mine = false,
  avatar = '',
  text = 'hello',
  at = new Date(),
}) => (
  <div class={`dm-container${mine ? ' mine' : ''}`}>
    <div class={`dm-message${mine ? ' mine' : ''}`}>
      <img src={createAvatar(avatar)} />
      <span>{text}</span>
    </div>
    <p>{formatDate(String(at))}</p>
  </div>
);
