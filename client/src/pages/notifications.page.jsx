/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import FilterPaginationData from "../common/filter-pagination-data";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import NotificationCard from "../components/notification-card.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";

const Notifications = () => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(null);

  let filters = ["all", "like", "comment", "reply"];

  let {
    userAuth,
    userAuth: { new_notification_available } = {},
    setUserAuth,
  } = useContext(UserContext);
  let accessToken = userAuth?.accessToken;

  const fetchNotifications = ({ page, deleteDocCount = 0 }) => {
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/notifications",
        { page, filter, deleteDocCount },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(async ({ data: { notifications: data } }) => {
        if (new_notification_available) {
          setUserAuth({ ...userAuth, new_notification_available: false });
        }

        let formattedData = await FilterPaginationData({
          state: notifications,
          data,
          page,
          countRoute: "/all-notifications-count",
          data_to_send: { filter },
          user: accessToken,
        });

        setNotifications(formattedData);
        console.log(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFilter = (e) => {
    let btn = e.target;
    setFilter(btn.innerHTML);
    setNotifications(null);
  };

  useEffect(() => {
    if (accessToken) {
      fetchNotifications({ page: 1 });
    }
  }, [accessToken, filter]);

  return (
    <div>
      <h1 className="max-md:hidden">Recent Notifications</h1>

      <div className="my-8 flex gap-6">
        {filters.map((filterName, i) => {
          return (
            <button
              key={i}
              className={
                "py-1 " + (filter === filterName ? "btn-dark" : "btn-light")
              }
              onClick={handleFilter}
            >
              {filterName}
            </button>
          );
        })}
      </div>

      {notifications === null ? (
        <Loader />
      ) : (
        <>
          {
            //.....................
            notifications.results.length ? (
              notifications.results.map((notification, i) => {
                return (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.2 }}>
                    <NotificationCard
                      data={notification}
                      index={i}
                      notificationsState={(notifications, setNotifications)}
                    />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="Nothing available" />
            )
          }

          {
            <LoadMoreDataBtn
              state={notifications}
              fetchData={fetchNotifications}
              additionalParam={{ deleteDocCount: notifications.deleteDocCount }}
            />
          }
        </>
      )}
    </div>
  );
};

export default Notifications;
