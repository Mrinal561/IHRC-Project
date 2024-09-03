import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'

const StatisticCard = ({ icon, bgColor, title, value }) => {
    return (
      <div className="bg-white p-4 flex items-center border rounded-lg">
        <div className={`${bgColor} p-2 rounded-lg h-14 w-14 flex items-center justify-center mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className='font-semibold text-lg'>{title}</h3>
          <p className='font-medium text-[#7583a2]'>{value}</p>
        </div>
      </div>
    );
  };
  

const Statistic = () => {
    const statistics = [
      {
        title: 'Total Pending Compliances',
        value: '300',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(8,145,178,1)" width="28" height="28">
            <path d="M17 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H7V0H9V2H15V0H17V2ZM17 4V6H15V4H9V6H7V4H5V20H19V4H17ZM7 8H17V10H7V8ZM7 12H17V14H7V12Z"></path>
          </svg>
        ),
        bgColor: 'bg-[#cffafe]',
      },
      {
        title: 'Upcoming',
        value: '200',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(217,119,6,1)" width="28" height="28">
            <path d="M7 1V3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H10.7546C9.65672 19.6304 9 17.8919 9 16C9 11.5817 12.5817 8 17 8C18.8919 8 20.6304 8.65672 22 9.75463V4C22 3.44772 21.5523 3 21 3H17V1H15V3H9V1H7ZM23 16C23 19.3137 20.3137 22 17 22C13.6863 22 11 19.3137 11 16C11 12.6863 13.6863 10 17 10C20.3137 10 23 12.6863 23 16ZM16 12V16.4142L18.2929 18.7071L19.7071 17.2929L18 15.5858V12H16Z"></path>
          </svg>
        ),
        bgColor: 'bg-[#fef3c7]',
      },
      {
        title: 'Overdue',
        value: '100',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(5,150,105,1)" width="28" height="28">
            <path d="M6 4H4V2H20V4H18V6C18 7.61543 17.1838 8.91468 16.1561 9.97667C15.4532 10.703 14.598 11.372 13.7309 12C14.598 12.628 15.4532 13.297 16.1561 14.0233C17.1838 15.0853 18 16.3846 18 18V20H20V22H4V20H6V18C6 16.3846 6.81616 15.0853 7.8439 14.0233C8.54682 13.297 9.40202 12.628 10.2691 12C9.40202 11.372 8.54682 10.703 7.8439 9.97667C6.81616 8.91468 6 7.61543 6 6V4ZM8 4V6C8 6.68514 8.26026 7.33499 8.77131 8H15.2287C15.7397 7.33499 16 6.68514 16 6V4H8ZM12 13.2219C10.9548 13.9602 10.008 14.663 9.2811 15.4142C9.09008 15.6116 8.92007 15.8064 8.77131 16H15.2287C15.0799 15.8064 14.9099 15.6116 14.7189 15.4142C13.992 14.663 13.0452 13.9602 12 13.2219Z"></path>
          </svg>
        ),
        bgColor: 'bg-[#d1fae5]',
      },
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statistics.map((stat, index) => (
          <StatisticCard
            key={index}
            icon={stat.icon}
            bgColor={stat.bgColor}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>
    );
  };
  
  export default Statistic;