import {
  ExclamationIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';

type Type = 'note' | 'warning' | 'caution';

type Props = {
  type: Type;
  content: string;
};

function getTypeClasses(type: Type) {
  switch (type) {
    case 'note':
      return 'border-blue-200 bg-blue-100 text-blue-500';
    case 'warning':
      return 'border-yellow-200 bg-yellow-100 text-yellow-500';
    case 'caution':
      return 'border-red-200 bg-red-100 text-red-400';
  }
}

function CalloutIcon({ type }: { type: Type }) {
  switch (type) {
    case 'note':
      return <InformationCircleIcon className="w-6 h-6" />;
    case 'warning':
      return <ExclamationIcon className="w-6 h-6" />;
    case 'caution':
      return <ExclamationIcon className="w-6 h-6" />;
  }
}

function Callout({ content, type }: Props) {
  const classes = getTypeClasses(type);

  return (
    <div
      className={
        'border-2 flex items-center my-4 p-4 rounded-md text-sm font-bold ' +
        classes
      }
    >
      <div className="mr-2">
        <CalloutIcon type={type} />
      </div>
      <div>{content}</div>
    </div>
  );
}

export default Callout;
