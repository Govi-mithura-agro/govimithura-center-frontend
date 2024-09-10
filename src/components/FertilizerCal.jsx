 {/* Properly close this div */}
 <Modal
 title="Fertilizer Calculation Results"
 visible={isModalVisible}
 onOk={() => setIsModalVisible(false)}
 onCancel={() => setIsModalVisible(false)}
 footer={[
   <Button key="back" onClick={() => setIsModalVisible(false)}>
     Close
   </Button>,
 ]}
>

</Modal>