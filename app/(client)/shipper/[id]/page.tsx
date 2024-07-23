"use client";
import { EShipmentStatus } from "@/constant/enum";
import { Chip, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
const ShipperPage = ({ params }: { params: { id: string } }) => {
  const shipmentId = params.id;
  const [shipment, setShipment] = useState<any>(null);

  const [status, setStatus] = useState<string>(undefined);
  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const response = await axios.get(`/api/shipment/${params.id}`); // Replace '123' with dynamic ID if needed
        setShipment(response.data.data);
        setStatus(EShipmentStatus[response.data.data.status]);
      } catch (error) {
        console.error("Error fetching shipment data:", error);
      }
    };
    fetchShipment();
  }, [params.id]);
  const updateLocation = async (latitude: number, longitude: number) => {
    if (shipmentId && longitude && longitude && status) {
      await axios.put(`/api/shipment/${shipmentId}`, {
        status,
        currentLocation: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      });
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log({ coord: position.coords });
          updateLocation(latitude, longitude);
        const timeout = setTimeout(() => {
          if (status === EShipmentStatus.Shipping) {
            updateLocation(latitude, longitude);
          }
        }, 5000);
      });

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [status, shipmentId]);
  const changeStatus = async (e) => {
    setStatus(e.target.value);
   
  };
  return (
    <div className="p-2">
      <h1>Shipper Page</h1>
      <p>Shipment ID: {shipmentId}</p>
      <div>
        Status:
        <Select
          items={Object.keys(EShipmentStatus).map((key) => ({
            key,
            value: EShipmentStatus[key],
          }))}
          label="Ship Status"
          placeholder="Select a Status"
          classNames={{
            base: "max-w-xs",
            trigger: "min-h-12 py-2",
          }}
          selectedKeys={[status]}
          onChange={(e) => changeStatus(e)}
          renderValue={(items) => {
            return (
              <div className="flex flex-wrap gap-2">
                {items?.map((item) => (
                  <Chip key={item.key}>{item?.data?.value}</Chip>
                ))}
              </div>
            );
          }}
        >
          {(status) => (
            <SelectItem key={status.key} textValue={status.value}>
              <div className="flex gap-2 items-center">
                <div className="flex flex-col">
                  <span className="text-small">{status.value}</span>
                </div>
              </div>
            </SelectItem>
          )}
        </Select>
      </div>
    </div>
  );
};

export default ShipperPage;
